# Availability engine

Answers: *for these dates and this party, which room types can actually be booked?*

## Layers

| Layer | File | Responsibility |
|---|---|---|
| Pure engine | `src/domain/availability/engine.ts`, `dateRange.ts` | All rules. No I/O, no Prisma, no React. Unit-tested. |
| Data access | `inventory-repository.ts` (demo data today) / `service.ts` (Prisma, not yet wired) | Reads a **narrowed window** (only bookings/blocks overlapping the range) and maps to snapshots. |
| Boundary | `src/lib/integrations/availability.ts` | Search policy (no past dates, ≤ 30 nights, ≤ 1 year ahead), event emission, error mapping. |
| UI | `/availability`, `AvailabilityResultCard` | Renders engine output only. No counts or rules in JSX. |

## Domain

```
Hotel ─< Property ─< RoomType ─< Room ─< BookingRoom >─ Booking ─< BookingGuest
                                  └─< RoomBlock
```

* **RoomType** is what guests buy (name, price, capacity). **Room** is the physical unit (501, 502…). Many rooms share a type; availability is *counted*, never a boolean on the type.
* **Room.status** (`ACTIVE`, `OUT_OF_SERVICE`, `MAINTENANCE`, `RETIRED`) is the long-lived operational state. Only `ACTIVE` rooms are sellable. It is **not** date availability: "occupied on 12 Oct" or "blocked 20–22 Oct" are derived from `BookingRoom` + `RoomBlock` for the dates asked about, never stored on the room.
* **BookingRoom** links a booking to the physical room(s) it holds. Stay dates live on `Booking`.
* **RoomBlock** removes one room from sale for a date range (reason, notes, status, creator).

## Date semantics

A stay or block from **A to B occupies the half-open interval `[A, B)`**: A included, B excluded. 12 Oct → 14 Oct occupies the nights of 12 and 13; the room can be re-sold with check-in on 14 Oct.

Two intervals overlap iff `aStart < bEnd && bStart < aEnd`. Dates are ISO `YYYY-MM-DD` strings (no timestamps, no timezones); fixed-width ISO strings compare chronologically.

## Rules

1. Only rooms with `status = ACTIVE` count.
2. A room is unavailable if any **blocking** booking overlaps the range.
3. A room is unavailable if any **ACTIVE** room block overlaps the range.
4. `availableUnits` = rooms of the type passing 1–3 for the *whole* range.
5. A party **fits** a type if, per room (party split evenly across `rooms`): `ceil(adults/rooms) ≤ maxAdults`, `ceil(children/rooms) ≤ maxChildren`, and their sum `≤ maxOccupancy`.
6. `isBookable = fits && availableUnits ≥ requested rooms`. Otherwise `unavailableReason` is `capacity`, `sold_out` or `insufficient_units`.

### Booking status behaviour (business rule — revisit if policy differs)

| Status | Holds inventory? | Why |
|---|---|---|
| PENDING | yes | Reserved awaiting confirmation; releasing it would allow double promises. |
| CONFIRMED | yes | |
| CHECKED_IN | yes | |
| CHECKED_OUT | yes | The nights were occupied (history/calendar); future searches never overlap it. |
| CANCELLED | **no** | |
| NO_SHOW | **no** | Room treated as free again. Change if no-shows keep nights held. |

Room blocks: `ACTIVE` blocks hold the room; `CANCELLED` blocks (an "unblock") don't but are kept for audit.

## Query validation

Server-authoritative (`validateAvailabilityQuery`): valid ISO dates, check-out after check-in, ≥ 1 adult, children ≥ 0, ≥ 1 room, at least one adult per room. The Zod schema in `lib/validation/booking.ts` is UX-level and re-run on the server page; policy limits live in the integration boundary.

## Overbooking & concurrency strategy

A search result is a **snapshot, not a promise**. Two guests can both see "1 room left".

1. **Never trust the search.** Booking creation must run in one `SERIALIZABLE` transaction that re-reads the window *inside* the transaction and calls `canReserve` (sketched in `service.ts → reserveWithRecheck`).
2. **Database-level guard.** In that same transaction, materialise one `RoomInventory` row per room per night. `UNIQUE(roomId, date)` makes a second writer for the same room-night fail atomically, so a race cannot double-book even if application logic has a bug. The loser gets a retry/"just sold" response.
3. **Room assignment** picks specific free rooms inside the transaction (e.g. `SELECT … FOR UPDATE SKIP LOCKED` on candidate rooms) so concurrent bookings of one type don't fight over the same room.
4. Room blocks must also write `RoomInventory` (`BLOCKED`) or be re-checked in the same transaction.

**Known gap:** the search path reads `Booking`/`BookingRoom`/`RoomBlock`; the write guard uses `RoomInventory`. They must be written in the same transaction so they cannot drift. Not implemented yet (booking engine step).

## Indexes

* `bookings (propertyId, status, checkInDate, checkOutDate)`
* `booking_rooms (roomId)`, `UNIQUE (bookingId, roomId)`
* `room_blocks (roomId, status, startDate, endDate)`
* `rooms (propertyId, roomTypeId, status)`
* existing: `room_inventory UNIQUE (roomId, date)`

## Events

`emitEvent` seams (no handlers yet): `availability_search_completed` (emitted on every search), `room_blocked`, `room_unblocked`, plus existing `booking_created|confirmed|cancelled`, `low_inventory`.

## Security

`createRoomBlock` validates → `requireRole("FRONT_DESK")` → (to implement with the DB) verifies the room belongs to the staff member's hotel/property → checks held bookings → writes block + audit log. `roomId` from the browser is never trusted. Until Step 1's auth boundary has a real identity provider, every call is refused with `UNAUTHENTICATED` (tested).

/**
 * Automation event catalog.
 *
 * Every future automated workflow (confirmations, reminders, alerts) is
 * triggered by one of these events rather than being called directly from
 * booking/payment code. This keeps features decoupled: the booking flow
 * only needs to know it happened, not who cares or how they're notified.
 *
 * Flow: domain action -> emitEvent(name, payload) -> registered handlers
 * (queued as Notification rows / future job queue) -> delivery -> audit log.
 */

export const AUTOMATION_EVENTS = {
  BOOKING_CREATED: "booking_created",
  BOOKING_CONFIRMED: "booking_confirmed",
  BOOKING_CANCELLED: "booking_cancelled",
  BOOKING_MODIFIED: "booking_modified",
  PAYMENT_SUCCESS: "payment_success",
  PAYMENT_FAILED: "payment_failed",
  CHECK_IN_DUE: "check_in_due",
  CHECK_OUT_DUE: "check_out_due",
  ABANDONED_BOOKING: "abandoned_booking",
  LOW_INVENTORY: "low_inventory",
  ROOM_BLOCKED: "room_blocked",
  ROOM_UNBLOCKED: "room_unblocked",
  AVAILABILITY_SEARCH_COMPLETED: "availability_search_completed",
} as const;

export type AutomationEventName =
  (typeof AUTOMATION_EVENTS)[keyof typeof AUTOMATION_EVENTS];

/**
 * Each event carries a minimal, typed payload — enough for a handler to
 * look up whatever else it needs, not a full denormalized snapshot.
 */
export interface AutomationEventPayloads {
  [AUTOMATION_EVENTS.BOOKING_CREATED]: { bookingId: string };
  [AUTOMATION_EVENTS.BOOKING_CONFIRMED]: { bookingId: string };
  [AUTOMATION_EVENTS.BOOKING_CANCELLED]: { bookingId: string; reason?: string };
  [AUTOMATION_EVENTS.BOOKING_MODIFIED]: { bookingId: string };
  [AUTOMATION_EVENTS.PAYMENT_SUCCESS]: { bookingId: string; paymentId: string };
  [AUTOMATION_EVENTS.PAYMENT_FAILED]: { bookingId: string; paymentId: string };
  [AUTOMATION_EVENTS.CHECK_IN_DUE]: { bookingId: string };
  [AUTOMATION_EVENTS.CHECK_OUT_DUE]: { bookingId: string };
  [AUTOMATION_EVENTS.ABANDONED_BOOKING]: { bookingId: string };
  [AUTOMATION_EVENTS.LOW_INVENTORY]: { propertyId: string; roomTypeId: string; date: string; availableUnits?: number };
  [AUTOMATION_EVENTS.ROOM_BLOCKED]: { roomId: string; blockId: string; reason: string; startDate: string; endDate: string };
  [AUTOMATION_EVENTS.ROOM_UNBLOCKED]: { roomId: string; blockId: string };
  [AUTOMATION_EVENTS.AVAILABILITY_SEARCH_COMPLETED]: {
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    rooms: number;
    bookableRoomTypes: number;
  };
}

export type AutomationHandler<E extends AutomationEventName> = (
  payload: AutomationEventPayloads[E],
) => Promise<void> | void;

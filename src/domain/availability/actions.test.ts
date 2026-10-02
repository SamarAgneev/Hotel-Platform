import { describe, expect, it } from "vitest";
import { createRoomBlock } from "./actions";

const valid = { roomId: "room-503", startDate: "2026-10-20", endDate: "2026-10-22", reason: "Maintenance" };

describe("createRoomBlock (server action)", () => {
  it("rejects invalid date ranges on the server, whatever the client sent", async () => {
    const result = await createRoomBlock({ ...valid, startDate: "2026-10-22", endDate: "2026-10-20" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("VALIDATION");
      expect(result.fieldErrors?.endDate).toMatch(/after the start/i);
    }
  });

  it("rejects missing room and unknown reasons", async () => {
    const result = await createRoomBlock({ ...valid, roomId: "", reason: "Because" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.fieldErrors ?? {})).toEqual(expect.arrayContaining(["roomId", "reason"]));
  });

  it("is not publicly callable: a valid payload without a staff session is refused", async () => {
    const result = await createRoomBlock(valid);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("UNAUTHENTICATED");
  });
});

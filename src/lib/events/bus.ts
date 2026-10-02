import type {
  AutomationEventName,
  AutomationEventPayloads,
  AutomationHandler,
} from "./types";

/**
 * Minimal in-process event bus. Step 1 registers no real handlers — the
 * point is the seam: features call `emitEvent(...)` and never know or care
 * what (if anything) is listening. Step 2+ swaps this for a durable queue
 * (e.g. a Postgres-backed job table or a hosted queue) without touching
 * any call site, because the public shape (`emitEvent`, `onEvent`) stays
 * the same.
 */

type Handlers = {
  [K in AutomationEventName]?: AutomationHandler<K>[];
};

const handlers: Handlers = {};

export function onEvent<E extends AutomationEventName>(
  event: E,
  handler: AutomationHandler<E>,
): void {
  const list = (handlers[event] ??= []) as AutomationHandler<E>[];
  list.push(handler);
}

export async function emitEvent<E extends AutomationEventName>(
  event: E,
  payload: AutomationEventPayloads[E],
): Promise<void> {
  const list = handlers[event] as AutomationHandler<E>[] | undefined;
  if (!list || list.length === 0) return;

  // Handlers run independently: one failing must not block the others or
  // throw back into the caller's request/response cycle.
  await Promise.allSettled(list.map((handler) => handler(payload)));
}

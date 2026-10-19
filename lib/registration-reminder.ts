export const REMINDER_STATE_KEY = 'labortrader:registration-reminders:v2';
export const REGISTRATION_SAVED_KEY = 'labortrader:registration-saved';
export const REGISTRATION_SAVED_EVENT = 'labortrader:registration-saved';
export type ReminderStage = 0 | 1 | 2;
export type ReminderState = {
  startedAt: number;
  shown: ReminderStage;
  dismissedAt: number;
  stopped: boolean;
};

/** At most two prompts; a late visit gets the latest one, never a stacked pair. */
export function dueRegistrationReminder(
  state: ReminderState,
  now: number,
  visible: ReminderStage,
  busy: boolean,
): ReminderStage {
  if (state.stopped || visible || busy || state.shown === 2) return 0;
  if (state.dismissedAt && now - state.dismissedAt < 30_000) return 0;
  const elapsed = now - state.startedAt;
  if (elapsed >= 120_000) return 2;
  if (elapsed >= 40_000 && state.shown === 0) return 1;
  return 0;
}

export function readReminderState(
  raw: string | null,
  now: number,
): ReminderState {
  try {
    const value = JSON.parse(raw || 'null');
    if (
      value &&
      Number.isFinite(value.startedAt) &&
      value.startedAt > 0 &&
      value.startedAt <= now &&
      [0, 1, 2].includes(value.shown) &&
      Number.isFinite(value.dismissedAt) &&
      value.dismissedAt >= 0 &&
      value.dismissedAt <= now &&
      typeof value.stopped === 'boolean'
    )
      return value;
  } catch {
    /* Unavailable or stale browser state must not break the page. */
  }
  return { startedAt: now, shown: 0, dismissedAt: 0, stopped: false };
}

/** A presentation preference only; this never changes server registration status. */
export function markRegistrationSaved() {
  try {
    window.sessionStorage.setItem(REGISTRATION_SAVED_KEY, '1');
  } catch {
    /* Best effort. */
  }
  window.dispatchEvent(new Event(REGISTRATION_SAVED_EVENT));
}

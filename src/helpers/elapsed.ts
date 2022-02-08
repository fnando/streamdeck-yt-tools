type Elapsed = {
  hours: number;
  minutes: number;
  seconds: number;
};

type ElapsedKey = keyof Elapsed;

export function elapsed(seconds: number) {
  const state: Elapsed = { hours: 0, minutes: 0, seconds };

  if (state.seconds >= 60) {
    state.minutes = Math.floor(state.seconds / 60);
    state.seconds = state.seconds - state.minutes * 60;
  }

  if (state.minutes >= 60) {
    state.hours = Math.floor(state.minutes / 60);
    state.minutes = state.minutes - state.hours * 60;
  }

  if (state.hours === 0 && state.minutes === 0) {
    return `${Math.floor(state.seconds)}s`;
  }

  return Object.keys(state)
    .slice(0, 2)
    .map(
      (key) =>
        state[key as ElapsedKey] > 0 && state[key as ElapsedKey] + key[0],
    )
    .filter(Boolean)
    .join(" ");
}

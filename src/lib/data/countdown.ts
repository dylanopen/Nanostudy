const TIMER_END_TIME = 1798977600000;

export function hasLaunched(): boolean {
    return Date.now() >= TIMER_END_TIME;
}

export function getTimeUntilLaunch(): string {
    let msUntilDate = Date.now() - TIMER_END_TIME;
    let durationUntilDate = Temporal.Duration.from({ milliseconds: msUntilDate });
    return durationUntilDate.toString();
}

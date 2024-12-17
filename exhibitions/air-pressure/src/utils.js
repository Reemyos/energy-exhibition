export function pressureToJoule(pressure, volume=1.5) {
    return 101.325 * (pressure + 1) * volume * Math.log(pressure + 1);
}

export function pressureToCalorie(pressure, volume=1.5) {
    return pressureToJoule(pressure, volume) * 0.239;
}
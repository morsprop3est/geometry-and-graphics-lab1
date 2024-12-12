export const calculateWeightedArc = (
    startX, startY,
    controlX, controlY,
    endX, endY,
    steps
) => {
    const arcCoordinates = [];
    const wA = 1;
    const wB = 0.75;
    const wC = 1;

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;

        const denominator = (1 - t) * (1 - t) * wA + 2 * (1 - t) * t * wB + t * t * wC;

        const x = ((1 - t) * (1 - t) * startX * wA + 2 * (1 - t) * t * controlX * wB + t * t * endX * wC) / denominator;

        const y = ((1 - t) * (1 - t) * startY * wA + 2 * (1 - t) * t * controlY * wB + t * t * endY * wC) / denominator;

        arcCoordinates.push(['line', x, y]);
    }

    return arcCoordinates;
};

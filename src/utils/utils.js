export const calculateArc = (startX, startY, controlX, controlY, endX, endY, steps) => {
    const arcCoordinates = [];
    const controlPoints = [(startX + controlX) / 2, (startY + controlY) / 2];
    const endPoints = [(controlX + endX) / 2, (controlY + endY) / 2];

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
        const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;
        arcCoordinates.push(['line', x, y]);
    }

    return arcCoordinates;
};


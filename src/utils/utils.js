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

export const applyTransformation = (shapeCoordinates, matrix, setShapeCoordinates) => {
    const transformedCoordinates = shapeCoordinates.map(([type, ...coords]) => {
        if (type === 'line') {
            const [x, y] = coords;
            const [newX, newY] = [
                x * matrix[0][0] + y * matrix[0][1] + matrix[0][2],
                x * matrix[1][0] + y * matrix[1][1] + matrix[1][2],
            ];
            return ['line', newX, newY];
        }
        return [type, ...coords];
    });

    setShapeCoordinates(transformedCoordinates);
};

export const scaleShape = (shapeCoordinates, scaleX, scaleY, setShapeCoordinates) => {
    const scaleMatrix = [
        [scaleX, 0, 0],
        [0, scaleY, 0],
    ];
    applyTransformation(shapeCoordinates, scaleMatrix, setShapeCoordinates);
};

export const rotateShape = (shapeCoordinates, rotationAngle, pivotX, pivotY, setShapeCoordinates) => {
    const angle = (rotationAngle * Math.PI) / 180;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const rotatedCoordinates = shapeCoordinates.map(([type, x, y]) => {
        if (type === 'line') {
            const newX = cosA * (x - pivotX) - sinA * (y - pivotY) + pivotX;
            const newY = sinA * (x - pivotX) + cosA * (y - pivotY) + pivotY;
            return ['line', newX, newY];
        }
        return [type, x, y];
    });

    setShapeCoordinates(rotatedCoordinates);
};

export const translateShape = (shapeCoordinates, translateX, translateY, setShapeCoordinates) => {
    const translatedCoordinates = shapeCoordinates.map((coord) => {
        if (coord[0] === 'line') {
            return ['line', coord[1] + translateX, coord[2] + translateY];
        }
        return coord;
    });
    setShapeCoordinates(translatedCoordinates);
};

export const applySymmetryTransformations = (shapeCoordinates, pivot, setShapeCoordinates) => {
    const transformedCoordinates = shapeCoordinates.map(([type, x, y]) => {
        if (type === 'emptyPoint') {
            return ['emptyPoint'];
        }

        const newX = 2 * pivot.x - x;
        const newY = 2 * pivot.y - y;

        return [type, newX, newY];
    });

    setShapeCoordinates(transformedCoordinates);
};


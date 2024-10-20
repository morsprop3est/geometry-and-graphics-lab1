
export const calculateArc = (centerX, centerY, radius, startAngleDegrees, endAngleDegrees, steps) => {
    const arcCoordinates = [];
    const startAngle = (startAngleDegrees * Math.PI) / 180;
    const endAngle = (endAngleDegrees * Math.PI) / 180;
    const angleStep = (endAngle - startAngle) / steps;

    for (let i = 0; i <= steps; i++) {
        const angle = startAngle + i * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
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

export const applyAffineTransformations = (shapeCoordinates, matrix) => {
    const transformedCoordinates = [];

    for (let i = 0; i < shapeCoordinates.length; i++) {
        const point = shapeCoordinates[i];

        if (point[0] === 'emptyPoint') {
            transformedCoordinates.push(['emptyPoint']);
            continue;
        }

        const x = point[1];
        const y = point[2];
        const newX = (matrix[0][0] * x + matrix[1][0] * y + matrix[2][0]) / 10;
        const newY = (matrix[0][1] * x + matrix[1][1] * y + matrix[2][1]) / 10;

        transformedCoordinates.push(['line', newX, newY]);
    }

    return transformedCoordinates;
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

export const applyProjectiveTransformations = (shapeCoordinates, projectiveParameters) => {
    const transformedCoordinates = [];

    const [Xx, Xy, wX] = projectiveParameters[0];
    const [Yx, Yy, wY] = projectiveParameters[1];
    const [Ox, Oy, wO] = projectiveParameters[2];

    const projectiveMatrix = [
        [Xx * wX, Xy * wX, wX],
        [Yx * wY, Yy * wY, wY],
        [Ox * wO, Oy * wO, wO],
    ];

    for (let i = 0; i < shapeCoordinates.length; i++) {
        const [type, x, y] = shapeCoordinates[i];

        if (type === 'emptyPoint') {
            transformedCoordinates.push(['emptyPoint']);
            continue;
        }

        const denominator = x * projectiveMatrix[0][2] + y * projectiveMatrix[1][2] + projectiveMatrix[2][2];
        const newX = ((x * projectiveMatrix[0][0] + y * projectiveMatrix[1][0] + projectiveMatrix[2][0]) / denominator) * 5;
        const newY = ((x * projectiveMatrix[0][1] + y * projectiveMatrix[1][1] + projectiveMatrix[2][1]) / denominator) * 5;

        transformedCoordinates.push([type, newX, newY]);
    }

    return transformedCoordinates;
};
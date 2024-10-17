
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

    const rotationMatrix = [
        [cosA, -sinA, pivotX * (1 - cosA) + pivotY * sinA],
        [sinA, cosA, pivotY * (1 - cosA) - pivotX * sinA],
    ];

    applyTransformation(shapeCoordinates, rotationMatrix, setShapeCoordinates);
};


const matrixMultiplication = (m1, m2) => {
    const result = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            result[i][j] = m1[i][0] * m2[0][j] + m1[i][1] * m2[1][j] + m1[i][2] * m2[2][j];
        }
    }
    return result;
};
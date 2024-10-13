export const multiplyMatrix = (matrix, point) => {
    const { x, y } = point;
    return {
        x: matrix[0][0] * x + matrix[0][1] * y + matrix[0][2],
        y: matrix[1][0] * x + matrix[1][1] * y + matrix[1][2],
    };
};

export const getRotationMatrix = (angle) => {
    return [
        [Math.cos(angle), -Math.sin(angle), 0],
        [Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1],
    ];
};

export const getTranslationMatrix = (dx, dy) => {
    return [
        [1, 0, dx],
        [0, 1, dy],
        [0, 0, 1],
    ];
};

export const getScalingMatrix = (sx, sy) => {
    return [
        [sx, 0, 0],
        [0, sy, 0],
        [0, 0, 1],
    ];
};

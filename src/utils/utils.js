export const rotateShape = (coordinates, angle, pivotX, pivotY, setCoordinates) => {
    const radians = angle * (Math.PI / 180); // Конвертуємо градуси в радіани
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    const rotatedCoordinates = coordinates.map(([type, x, y]) => {
        const newX = cos * (x - pivotX) - sin * (y - pivotY) + pivotX;
        const newY = sin * (x - pivotX) + cos * (y - pivotY) + pivotY;
        return [type, newX, newY];
    });

    setCoordinates(rotatedCoordinates);
};

export const translateShape = (coordinates, translateX, translateY, setCoordinates) => {
    const translatedCoordinates = coordinates.map(([type, x, y]) => {
        return [type, x + translateX, y + translateY];
    });

    setCoordinates(translatedCoordinates);
};
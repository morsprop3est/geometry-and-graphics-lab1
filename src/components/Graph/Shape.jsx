import React, { useEffect, useRef } from 'react';
import styles from './Graph.module.scss';

const degreesToRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
};

const applyTransformation = (x, y, rotationAngle, scaleX, scaleY, pivotX, pivotY) => {
    const angleInRadians = degreesToRadians(rotationAngle);

    const translatedX = x - pivotX;
    const translatedY = y - pivotY;

    const scaledX = translatedX * scaleX;
    const scaledY = translatedY * scaleY;

    const rotatedX = scaledX * Math.cos(angleInRadians) - scaledY * Math.sin(angleInRadians);
    const rotatedY = scaledX * Math.sin(angleInRadians) + scaledY * Math.cos(angleInRadians);

    return {
        transformedX: rotatedX + pivotX,
        transformedY: rotatedY + pivotY,
    };
};

const calculateArcPoints = (center, radiusX, radiusY, startAngle, endAngle, steps = 100) => {
    const points = [];
    const angleStep = (endAngle - startAngle) / steps;

    for (let i = 0; i <= steps; i++) {
        const angle = startAngle + i * angleStep;
        const x = center.x + radiusX * Math.cos(angle);
        const y = center.y + radiusY * Math.sin(angle);
        points.push({ x, y });
    }

    return points;
};

const Shape = ({ shapeCoordinates, canvasWidth, canvasHeight, rotationAngle, scaleX, scaleY, pivotX, pivotY }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvasWidth;
        const height = canvasHeight;

        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.beginPath();

        const centerX = width / 2;
        const centerY = height / 2;

        let lastPoint = null;

        shapeCoordinates.forEach((coord) => {
            if (coord.center && coord.radius !== undefined) {
                // Handle arcs
                const transformedCenter = applyTransformation(
                    coord.center.x,
                    coord.center.y,
                    rotationAngle,
                    scaleX,
                    scaleY,
                    pivotX,
                    pivotY
                );

                const adjustedStartAngle = coord.startAngle + degreesToRadians(rotationAngle);
                const adjustedEndAngle = coord.endAngle + degreesToRadians(rotationAngle);

                const arcPoints = calculateArcPoints(
                    { x: transformedCenter.transformedX, y: transformedCenter.transformedY },
                    coord.radius * scaleX,
                    coord.radius * scaleY,
                    adjustedStartAngle,
                    adjustedEndAngle
                );

                arcPoints.forEach((point) => {
                    const adjustedX = point.x + centerX;
                    const adjustedY = centerY - point.y;

                    if (lastPoint) {
                        ctx.lineTo(adjustedX, adjustedY);
                    } else {
                        ctx.moveTo(adjustedX, adjustedY);
                    }

                    lastPoint = { x: adjustedX, y: adjustedY };
                });
            } else if (coord.x !== undefined && coord.y !== undefined) {
                // Handle points
                const { transformedX, transformedY } = applyTransformation(
                    coord.x,
                    coord.y,
                    rotationAngle,
                    scaleX,
                    scaleY,
                    pivotX,
                    pivotY
                );

                const adjustedX = transformedX + centerX;
                const adjustedY = centerY - transformedY;

                if (lastPoint) {
                    ctx.lineTo(adjustedX, adjustedY);
                } else {
                    ctx.moveTo(adjustedX, adjustedY);
                }

                lastPoint = { x: adjustedX, y: adjustedY };
            }
        });


        ctx.closePath();
        ctx.stroke();
    }, [shapeCoordinates, canvasWidth, canvasHeight, rotationAngle, scaleX, scaleY, pivotX, pivotY]);

    return (
        <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className={styles.canvas}
        ></canvas>
    );
};

export default Shape;

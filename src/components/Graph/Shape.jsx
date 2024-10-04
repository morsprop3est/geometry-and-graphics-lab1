import React, { useEffect, useRef } from 'react';
import styles from './Graph.module.scss';

const Shape = ({ shapeCoordinates, canvasWidth, canvasHeight }) => {
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

        shapeCoordinates.forEach((coord, index) => {
            let adjustedX, adjustedY;

            if (coord.center && coord.radius !== undefined) {
                adjustedX = coord.center.x + centerX;
                adjustedY = centerY - coord.center.y;

                const startAngle = coord.startAngle;
                const endAngle = coord.endAngle;

                const clockwise = startAngle < endAngle;

                ctx.arc(adjustedX, adjustedY, coord.radius, coord.startAngle, coord.endAngle, coord.counterclockwise);
            } else if (coord.x !== undefined && coord.y !== undefined) {
                adjustedX = coord.x + centerX;
                adjustedY = centerY - coord.y;
                if (index === 0) {
                    ctx.moveTo(adjustedX, adjustedY);
                } else {
                    ctx.lineTo(adjustedX, adjustedY);
                }
            }
        });

        ctx.closePath();
        ctx.stroke();
    }, [shapeCoordinates, canvasWidth, canvasHeight]);

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
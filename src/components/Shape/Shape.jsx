import React, { useEffect, useRef } from 'react';
import styles from './Shape.module.scss';

const Shape = ({ coordinates, asymptoteCoordinates, canvasSize, currentPoint }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        coordinates.forEach((coordinate, index) => {
            const [type, x, y] = coordinate;
            if (type === 'asymptote') return;

            const adjustedX = x;
            const adjustedY = canvasSize - y;

            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;

            if (index === 0 || coordinates[index - 1][0] === 'emptyPoint') {
                ctx.beginPath();
                ctx.moveTo(adjustedX, adjustedY);
            } else {
                ctx.lineTo(adjustedX, adjustedY);
            }

            if (type === 'emptyPoint') {
                ctx.closePath();
                ctx.stroke();
            }
        });

        if (coordinates.length > 0 && coordinates[coordinates.length - 1][0] !== 'emptyPoint') {
            ctx.closePath();
            ctx.stroke();
        }

        asymptoteCoordinates.forEach(([type, x, y], index) => {
            const adjustedX = x;
            const adjustedY = canvasSize - y;

            ctx.strokeStyle = 'red';
            ctx.lineWidth = 4;

            if (index === 0) {
                ctx.beginPath();
                ctx.moveTo(adjustedX, adjustedY);
            } else {
                ctx.lineTo(adjustedX, adjustedY);
            }

            if (index === asymptoteCoordinates.length - 1) {
                ctx.closePath();
                ctx.stroke();
            }
        });

        if (currentPoint) {
            const [_, pointX, pointY] = currentPoint;
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(pointX, canvasSize - pointY, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }, [coordinates, asymptoteCoordinates, canvasSize, currentPoint]);

    return <canvas ref={canvasRef} width={canvasSize} height={canvasSize} className={styles.canvas} />;
};

export default Shape;

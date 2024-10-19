import React, { useEffect, useRef } from 'react';
import styles from './Shape.module.scss';

const Shape = ({ coordinates, strokeStyle = 'black', lineWidth = 2, canvasSize }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;

        coordinates.forEach(([type, x, y], index) => {
            const adjustedX = x; // Тепер x без зміщення
            const adjustedY = canvasSize - y; // Зміщуємо Y так, щоб верхня частина канваса була 0
            if (type === 'line') {
                if (index === 0) {
                    ctx.moveTo(adjustedX, adjustedY);
                } else {
                    ctx.lineTo(adjustedX, adjustedY);
                }
            }
        });

        ctx.closePath();
        ctx.stroke();
    }, [coordinates, strokeStyle, lineWidth, canvasSize]);

    return <canvas ref={canvasRef} width={canvasSize} height={canvasSize} className={styles.canvas} />;
};

export default Shape;

import React, { useEffect, useRef } from 'react';
import styles from './Shape.module.scss';

const Shape = ({ coordinates, strokeStyle = 'black', lineWidth = 2, canvasSize }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;

        coordinates.forEach((coordinate, index) => {
            const [type, x, y] = coordinate;
            const adjustedX = x;
            const adjustedY = canvasSize - y;

            if (type === 'line') {
                if (index === 0 || coordinates[index - 1][0] === 'emptyPoint') {
                    ctx.beginPath();
                    ctx.moveTo(adjustedX, adjustedY);
                } else {
                    ctx.lineTo(adjustedX, adjustedY);
                }
            } else if (type === 'emptyPoint') {
                ctx.closePath();
                ctx.stroke();
            }
        });

        if (coordinates.length > 0 && coordinates[coordinates.length - 1][0] !== 'emptyPoint') {
            ctx.closePath();
            ctx.stroke();
        }
    }, [coordinates, strokeStyle, lineWidth, canvasSize]);

    return <canvas ref={canvasRef} width={canvasSize} height={canvasSize} className={styles.canvas} />;
};

export default Shape;

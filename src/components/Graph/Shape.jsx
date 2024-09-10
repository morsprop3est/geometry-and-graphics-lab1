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

        ctx.moveTo(shapeCoordinates[0].x, height - shapeCoordinates[0].y);

        shapeCoordinates.forEach((coord, index) => {
            const nextCoord = shapeCoordinates[(index + 1) % shapeCoordinates.length];
            ctx.lineTo(nextCoord.x, height - nextCoord.y);
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

import React, { useEffect, useRef } from 'react';
import styles from './Graph.module.scss';

const Graph = ({ canvasWidth, canvasHeight, gridSize, centerPoint }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvasWidth;
        const height = canvasHeight;

        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 0.5;

        for (let y = 0; y <= height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        for (let x = 0; x <= width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        ctx.strokeStyle = '#008000';
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();

        const pointX = centerPoint.x + width / 2;
        const pointY = centerPoint.y + height / 2;

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(pointX, pointY, 3, 0, Math.PI * 2);
        ctx.fill();
    }, [canvasWidth, canvasHeight, gridSize, centerPoint]);

    return (
        <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className={styles.canvas}
        ></canvas>
    );
};

export default Graph;

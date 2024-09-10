import React, { useEffect, useRef } from 'react';
import styles from './Graph.module.scss';

const Graph = ({ canvasWidth, canvasHeight, gridSize }) => {
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

        const arrowSize = 10;

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height - 1);
        ctx.lineTo(width, height - 1);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width - arrowSize, height - 1 - arrowSize);
        ctx.lineTo(width, height - 1);
        ctx.lineTo(width - arrowSize, height - 1 + arrowSize);
        ctx.stroke();

        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(1, 0);
        ctx.lineTo(1, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(1 - arrowSize, arrowSize);
        ctx.lineTo(1, 0);
        ctx.lineTo(1 + arrowSize, arrowSize);
        ctx.stroke();
    }, [canvasWidth, canvasHeight, gridSize]);

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

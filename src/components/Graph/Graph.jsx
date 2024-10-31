import React, { useEffect, useRef } from 'react';
import styles from './Graph.module.scss';

const Graph = ({ pivot, canvasSize }) => {
    const canvasRef = useRef(null);
    const gridSize = 20;
    const gridDensity = 2;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const step = gridSize / gridDensity;
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 1;

        for (let x = step; x < canvasSize; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasSize);
            ctx.stroke();
        }

        for (let y = step; y < canvasSize; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasSize, y);
            ctx.stroke();
        }

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(canvasSize / 2, 0);
        ctx.lineTo(canvasSize / 2, canvasSize);
        ctx.moveTo(0, canvasSize / 2);
        ctx.lineTo(canvasSize, canvasSize / 2);
        ctx.stroke();
    }, [canvasSize]);

    return <canvas ref={canvasRef} width={canvasSize} height={canvasSize} className={styles.canvas} />;
};

export default Graph;

import React, { useEffect, useRef } from 'react';
import styles from './Graph.module.scss';

const Graph = ({ pivot = { x: 0, y: 0 }, gridSize = 20, gridDensity = 2, gridColor = '#cccccc', canvasSize = 800 }) => {
    const canvasRef = useRef(null);

    const calculateGridLines = () => {
        const lines = [];
        const step = gridSize / gridDensity;
        const halfWidth = canvasSize / 2;
        const halfHeight = canvasSize / 2;

        for (let x = -halfWidth; x <= halfWidth; x += step) {
            lines.push({
                type: 'vertical',
                start: { x: halfWidth + x, y: 0 },
                end: { x: halfWidth + x, y: canvasSize },
            });
        }

        for (let y = -halfHeight; y <= halfHeight; y += step) {
            lines.push({
                type: 'horizontal',
                start: { x: 0, y: halfHeight + y },
                end: { x: canvasSize, y: halfHeight + y },
            });
        }

        return lines.flatMap((line) => [
            ['line', line.start.x, line.start.y],
            ['line', line.end.x, line.end.y],
        ]);
    };

    const drawGrid = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const gridCoordinates = calculateGridLines();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;

        for (let i = 0; i < gridCoordinates.length; i += 2) {
            const start = gridCoordinates[i];
            const end = gridCoordinates[i + 1];

            ctx.beginPath();

            const isInitialXLine = start[2] === 0 && end[2] === 0;
            const isInitialYLine = start[1] === 0 && end[1] === 0;

            if (isInitialXLine) {
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
            } else if (isInitialYLine) {
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 2;
            } else {
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 0.5;
            }

            ctx.moveTo(start[1], canvas.height - start[2]);
            ctx.lineTo(end[1], canvas.height - end[2]);
            ctx.stroke();
        }

        if (pivot) {
            ctx.beginPath();
            ctx.arc(
                pivot.x * (gridSize / 20),
                canvas.height - pivot.y * (gridSize / 20),
                4,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = 'blue';
            ctx.fill();
        }
    };

    useEffect(() => {
        drawGrid();
    }, [gridSize, gridDensity, gridColor, canvasSize, pivot]);

    return <canvas ref={canvasRef} width={canvasSize} height={canvasSize} className={styles.canvas} />;
};

export default Graph;

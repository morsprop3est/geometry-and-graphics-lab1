import React, { useEffect, useRef } from 'react';
import styles from './Graph.module.scss';

const Graph = ({ pivot, gridCoordinates, gridColor, canvasSize, gridSize, defaultGridSize }) => {
    const canvasRef = useRef(null);

    const drawGrid = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const pivotX = pivot ? pivot.x * (gridSize / defaultGridSize) : 0;
        const pivotY = pivot ? pivot.y * (gridSize / defaultGridSize) : 0;

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
                ctx.lineWidth = 4;
            } else if (isInitialYLine) {
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 4;
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
                pivotX,
                canvas.height - pivotY,
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
    }, [gridCoordinates, gridColor, pivot]);


    return (
        <canvas ref={canvasRef} width={canvasSize} height={canvasSize} className={styles.canvas} />
    );
};

export default Graph;

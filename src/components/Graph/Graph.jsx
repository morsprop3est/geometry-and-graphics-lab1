import React, { useEffect, useRef } from 'react';
import styles from './Graph.module.scss';

const Graph = ({ pivot, gridSize, gridDensity, gridColor, canvasSize }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const step = gridSize / gridDensity;

        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;

        for (let x = -canvas.width / 2; x <= canvas.width / 2; x += step) {
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2 + x, 0);
            ctx.lineTo(canvas.width / 2 + x, canvas.height);
            ctx.stroke();
        }

        for (let y = -canvas.height / 2; y <= canvas.height / 2; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2 - y);
            ctx.lineTo(canvas.width, canvas.height / 2 - y);
            ctx.stroke();
        }

        ctx.lineWidth = 1;

        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        ctx.strokeStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();

        const arrowLength = 10;
        const arrowWidth = 5;

        ctx.beginPath();
        ctx.moveTo(canvas.width, canvas.height / 2);
        ctx.lineTo(canvas.width - arrowLength, (canvas.height / 2) - arrowWidth);
        ctx.lineTo(canvas.width - arrowLength, (canvas.height / 2) + arrowWidth);
        ctx.closePath();
        ctx.fillStyle = 'black';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo((canvas.width / 2) - arrowWidth, arrowLength);
        ctx.lineTo((canvas.width / 2) + arrowWidth, arrowLength);
        ctx.closePath();
        ctx.fillStyle = 'black';
        ctx.fill();

        ctx.strokeStyle = 'red';
        for (let x = -canvas.width / 2; x <= canvas.width / 2; x += step) {
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2 + x, (canvas.height / 2) - 5);
            ctx.lineTo(canvas.width / 2 + x, (canvas.height / 2) + 5);
            ctx.stroke();
        }

        ctx.strokeStyle = 'green';
        for (let y = -canvas.height / 2; y <= canvas.height / 2; y += step) {
            ctx.beginPath();
            ctx.moveTo((canvas.width / 2) - 5, canvas.height / 2 - y);
            ctx.lineTo((canvas.width / 2) + 5, canvas.height / 2 - y);
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(canvas.width / 2 + pivot.x, canvas.height / 2 - pivot.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();

    }, [pivot, gridSize, gridDensity, gridColor, canvasSize]);


    return (
        <canvas ref={canvasRef} width={canvasSize} height={canvasSize} className={styles.canvas} />
    );
};

export default Graph;

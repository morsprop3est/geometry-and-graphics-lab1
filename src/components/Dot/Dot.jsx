import React, { useEffect, useRef } from 'react';
import styles from './Dot.module.scss';

const Dot = ({ canvasSize, dotCoordinates, angle, isTangentVisible, isNormalVisible }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const { x, y } = dotCoordinates;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();

        const tangentLength = 150;

        if (isTangentVisible) {
            const dx = Math.cos(angle) * tangentLength;
            const dy = Math.sin(angle) * tangentLength;
            ctx.beginPath();
            ctx.moveTo(x - dx, y - dy);
            ctx.lineTo(x + dx, y + dy);
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        if (isNormalVisible) {
            const normalAngle = angle + Math.PI / 2;
            const perpDx = Math.cos(normalAngle) * tangentLength;
            const perpDy = Math.sin(normalAngle) * tangentLength;

            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            ctx.moveTo(x - perpDx, y - perpDy);
            ctx.lineTo(x + perpDx, y + perpDy);
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }, [dotCoordinates, angle, isTangentVisible, isNormalVisible]);

    return (
        <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            className={styles.canvas}
        />
    );
};

export default Dot;

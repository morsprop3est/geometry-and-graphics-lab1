import React, { useEffect, useRef, useState } from 'react';
import styles from './Shape.module.scss';
import { calculateArc } from '../../utils/utils';

const Shape = ({ elements, canvasSize, updateElementPosition, showPoints = true, showLines = true }) => {
    const canvasRef = useRef(null);
    const [dragging, setDragging] = useState(null);

    const getMousePosition = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: canvasSize - (event.clientY - rect.top),
        };
    };

    const checkIfDragging = (x, y) => {
        for (const element of elements) {
            for (const pointType of ['start', 'control', 'end']) {
                const pointX = element[`${pointType}X`];
                const pointY = element[`${pointType}Y`];
                const distance = Math.hypot(x - pointX, y - pointY);

                if (distance < 15) {
                    return { id: element.id, pointType };
                }
            }
        }
        return null;
    };

    const handleMouseDown = (event) => {
        const { x, y } = getMousePosition(event);
        const dragData = checkIfDragging(x, y);

        if (dragData) {
            setDragging(dragData);
        }
    };

    const handleMouseMove = (event) => {
        if (!dragging) return;

        const { x, y } = getMousePosition(event);
        updateElementPosition(dragging.id, dragging.pointType, x, y);
    };

    const handleMouseUp = () => {
        setDragging(null);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        elements.forEach((element) => {
            const arcPoints = calculateArc(
                element.startX,
                element.startY,
                element.controlX,
                element.controlY,
                element.endX,
                element.endY,
                20
            );

            // Малюємо дуги
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.beginPath();
            arcPoints.forEach(([type, x, y], index) => {
                const adjustedY = canvasSize - y;
                if (type === 'line') {
                    if (index === 0) {
                        ctx.moveTo(x, adjustedY);
                    } else {
                        ctx.lineTo(x, adjustedY);
                    }
                }
            });
            ctx.stroke();

            if (showLines) {
                ctx.beginPath();
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 0.5;

                ctx.moveTo(element.startX, canvasSize - element.startY);
                ctx.lineTo(element.controlX, canvasSize - element.controlY);
                ctx.lineTo(element.endX, canvasSize - element.endY);
                ctx.stroke();
            }

            if (showPoints) {
                ['start', 'control', 'end'].forEach((pointType) => {
                    const pointX = element[`${pointType}X`];
                    const pointY = element[`${pointType}Y`];
                    const adjustedY = canvasSize - pointY;

                    ctx.beginPath();
                    ctx.arc(pointX, adjustedY, 5, 0, Math.PI * 2);
                    ctx.fillStyle = 'green';
                    ctx.fill();
                    ctx.closePath();
                });
            }
        });
    }, [elements, canvasSize, showPoints, showLines]);

    return (
        <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            className={styles.canvas}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        />
    );
};

export default Shape;

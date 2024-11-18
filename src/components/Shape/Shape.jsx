import React, { useEffect, useRef, useState } from 'react';
import styles from './Shape.module.scss';
import { calculateArc, calculateWeightedArc  } from '../../utils/utils';

const Shape = ({
                   elements,
                   canvasSize,
                   updateElementPosition,
                   showPoints,
                   showLines,
                   scaleX,
                   scaleY,
                   translateX,
                   translateY,
                   rotate,
                   pivotX,
                   pivotY,
                   setPivotPosition,
               }) => {
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

                if (distance <= 5) {
                    return { id: element.id, pointType };
                }
            }
        }

        const distanceToPivot = Math.hypot(x - pivotX, y - pivotY);
        if (distanceToPivot <= 5) {
            return { pointType: 'pivot' };
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

        if (dragging.pointType === 'pivot') {
            setPivotPosition(x, y);
        } else {
            updateElementPosition(dragging.id, dragging.pointType, x, y);
        }
    };

    const handleMouseUp = () => {
        setDragging(null);
    };

    const applyTransformations = (x, y) => {
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;

        const angle = rotate;
        const rotatedX =
            pivotX + (scaledX - pivotX) * Math.cos((angle * Math.PI) / 180) - (scaledY - pivotY) * Math.sin((angle * Math.PI) / 180);
        const rotatedY =
            pivotY + (scaledX - pivotX) * Math.sin((angle * Math.PI) / 180) + (scaledY - pivotY) * Math.cos((angle * Math.PI) / 180);

        const translatedX = rotatedX + translateX;
        const translatedY = rotatedY + translateY;

        return { x: translatedX, y: translatedY };
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        elements.forEach((element) => {
            const transformedStart = applyTransformations(element.startX, element.startY);
            const transformedControl = applyTransformations(element.controlX, element.controlY);
            const transformedEnd = applyTransformations(element.endX, element.endY);

            const discriminator = 0.75;

            const wA = 1;
            const wB = discriminator/(1 - discriminator);
            const wC = 1;

            const arcPoints = calculateWeightedArc(
                transformedStart.x,
                transformedStart.y,
                transformedControl.x,
                transformedControl.y,
                transformedEnd.x,
                transformedEnd.y,
                20,
                wA, wB, wC
            );

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

                ctx.moveTo(transformedStart.x, canvasSize - transformedStart.y);
                ctx.lineTo(transformedControl.x, canvasSize - transformedControl.y);
                ctx.lineTo(transformedEnd.x, canvasSize - transformedEnd.y);
                ctx.stroke();
            }

            if (showPoints) {
                ['start', 'control', 'end'].forEach((pointType) => {
                    const pointX = element[`${pointType}X`];
                    const pointY = element[`${pointType}Y`];
                    const transformedPoint = applyTransformations(pointX, pointY);

                    const adjustedY = canvasSize - transformedPoint.y;

                    ctx.beginPath();
                    if (pointType === 'control') {
                        ctx.arc(transformedPoint.x, adjustedY, 4, 0, Math.PI * 2);
                        ctx.fillStyle = 'black';
                        ctx.fill();

                        ctx.beginPath();
                        ctx.arc(transformedPoint.x, adjustedY, 3, 0, Math.PI * 2);
                        ctx.fillStyle = '#47ce4e';
                        ctx.fill();
                    } else {
                        ctx.arc(transformedPoint.x, adjustedY, 3, 0, Math.PI * 2);
                        ctx.fillStyle = 'black';
                        ctx.fill();
                    }
                    ctx.closePath();
                });
            }
        });

        ctx.beginPath();
        ctx.arc(pivotX, canvasSize - pivotY, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
    }, [elements, canvasSize, showPoints, showLines, scaleX, scaleY, translateX, translateY, rotate, pivotX, pivotY]);


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

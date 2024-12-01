import React, { useEffect, useRef, useState } from 'react';
import styles from './Shape.module.scss';

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

    const processElements = (elements) => {
        if (elements.length === 0) return [];

        return elements.map((element, index, arr) => {
            const isLastElement = index === arr.length - 1;
            const nextElement = isLastElement ? arr[0] : arr[index + 1];

            const nodeX = element.endX ?? nextElement.startX;
            const nodeY = element.endY ?? nextElement.startY;

            const symmetricControlX = 2 * nodeX - element.controlX;
            const symmetricControlY = 2 * nodeY - element.controlY;

            return {
                ...element,
                endX: element.endX ?? nextElement.startX,
                endY: element.endY ?? nextElement.startY,
                symmetricControlX,
                symmetricControlY,
            };
        });
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

        const processedElements = processElements(elements);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        processedElements.forEach((element) => {
            const transformedStart = applyTransformations(element.startX, element.startY);
            const transformedControl = applyTransformations(element.controlX, element.controlY);
            const transformedEnd = applyTransformations(element.endX, element.endY);

            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(transformedStart.x, canvasSize - transformedStart.y);
            ctx.quadraticCurveTo(
                transformedControl.x,
                canvasSize - transformedControl.y,
                transformedEnd.x,
                canvasSize - transformedEnd.y
            );
            ctx.stroke();

            if (showLines) {
                ctx.strokeStyle = 'gray';
                ctx.lineWidth = 1;
                ctx.beginPath();
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

                    ctx.beginPath();
                    ctx.arc(transformedPoint.x, canvasSize - transformedPoint.y, 4, 0, Math.PI * 2);
                    ctx.fillStyle = pointType === 'control' ? 'red' : 'blue';
                    ctx.fill();
                    ctx.closePath();
                });
            }
        });

        ctx.beginPath();
        ctx.arc(pivotX, canvasSize - pivotY, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'green';
        ctx.fill();
    }, [elements, canvasSize, showPoints, showLines, scaleX, scaleY, translateX, translateY, rotate, pivotX, pivotY, processElements]);




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

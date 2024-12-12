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

    const pointsAreClose = (x1, y1, x2, y2, tolerance = 5) => {
        return Math.hypot(x2 - x1, y2 - y1) <= tolerance;
    };

    const mergeSmoothArcs = (arcs) => {
        const mergedArcs = [];
        const used = new Set();

        arcs.forEach((arc, i) => {
            if (used.has(i)) return;

            let currentArc = { ...arc };

            for (let j = 0; j < arcs.length; j++) {
                if (i === j || used.has(j)) continue;

                const nextArc = arcs[j];

                if (pointsAreClose(currentArc.endX, currentArc.endY, nextArc.startX, nextArc.startY)) {
                    const midX = currentArc.endX;
                    const midY = currentArc.endY;

                    const symmetricControlX = 2 * midX - currentArc.controlX;
                    const symmetricControlY = 2 * midY - currentArc.controlY;

                    mergedArcs.push(currentArc);

                    mergedArcs.push({
                        ...nextArc,
                        controlX: symmetricControlX,
                        controlY: symmetricControlY,
                    });

                    used.add(j);
                    return;
                }
            }

            mergedArcs.push(currentArc);
            used.add(i);
        });

        return mergedArcs;
    };

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
            const reversedPosition = reverseTransform(x, y);
            updateElementPosition(dragging.id, dragging.pointType, reversedPosition.x, reversedPosition.y);
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

    const reverseTransform = (x, y) => {
        const translatedX = x - translateX;
        const translatedY = y - translateY;

        const angle = -rotate;
        const rotatedX =
            pivotX + (translatedX - pivotX) * Math.cos((angle * Math.PI) / 180) - (translatedY - pivotY) * Math.sin((angle * Math.PI) / 180);
        const rotatedY =
            pivotY + (translatedX - pivotX) * Math.sin((angle * Math.PI) / 180) + (translatedY - pivotY) * Math.cos((angle * Math.PI) / 180);

        const scaledX = rotatedX / scaleX;
        const scaledY = rotatedY / scaleY;

        return { x: scaledX, y: scaledY };
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!canvas) return;

        const smoothElements = mergeSmoothArcs(elements);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        smoothElements.forEach((element) => {
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
                    ctx.arc(transformedPoint.x, adjustedY, 3, 0, Math.PI * 2);
                    ctx.fillStyle = pointType === 'control' ? 'green' : 'black';
                    ctx.fill();
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

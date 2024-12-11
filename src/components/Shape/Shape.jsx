import React, { useEffect, useRef, useState } from 'react';
import styles from './Shape.module.scss';

const Shape = ({
                   canvasSize,
                   scaleX,
                   scaleY,
                   translateX,
                   translateY,
                   rotate,
                   pivotX,
                   pivotY,
                   setPivotPosition,
                   ifsCoefficients,
                   iterations,
               }) => {
    const canvasRef = useRef(null);
    const [points, setPoints] = useState([]);

    const generateIFSPoints = (iterations, coeffs) => {
        let x = 0;
        let y = 0;
        const generatedPoints = [{ x, y }];

        for (let i = 0; i < iterations; i++) {
            const rand = Math.random();
            let sumP = 0;
            const chosenCoeff = coeffs.find((coeff) => {
                sumP += coeff.p;
                return rand <= sumP;
            });

            const newX = chosenCoeff.a * x + chosenCoeff.b * y + chosenCoeff.e;
            const newY = chosenCoeff.c * x + chosenCoeff.d * y + chosenCoeff.f;
            x = newX;
            y = newY;

            generatedPoints.push({ x, y });
        }

        return generatedPoints;
    };

    useEffect(() => {
        setPoints(generateIFSPoints(iterations, ifsCoefficients));
    }, [canvasSize, ifsCoefficients, iterations]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!canvas || points.length === 0) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        points.forEach((point) => {
            const transformed = applyTransformations(point.x, point.y);
            ctx.fillRect(transformed.x, canvasSize - transformed.y, 1, 1);
        });

        ctx.beginPath();
        ctx.arc(pivotX, canvasSize - pivotY, 5, 0, Math.PI * 2);
        ctx.fill();
    }, [points, canvasSize, scaleX, scaleY, translateX, translateY, rotate, pivotX, pivotY]);

    const applyTransformations = (x, y) => {
        const localX = x;
        const localY = y ;

        const scaledX = localX * scaleX * 100;
        const scaledY = localY * scaleY * 100;

        const angle = (rotate * Math.PI) / 180;
        const rotatedX = scaledX * Math.cos(angle) - scaledY * Math.sin(angle);
        const rotatedY = scaledX * Math.sin(angle) + scaledY * Math.cos(angle);

        const finalX = rotatedX + pivotX + translateX + 600;
        const finalY = rotatedY + pivotY + translateY - 100;

        return { x: finalX, y: finalY };
    };

    return (
        <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            className={styles.canvas}
        />
    );
};

export default Shape;

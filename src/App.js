import React, { useState, useEffect, useRef } from 'react';
import Shape from './components/Shape/Shape';
import Graph from './components/Graph/Graph';
import Dot from './components/Dot/Dot';
import SideMenu from './components/SideMenu/SideMenu';

const defaultCurveSettings = {
    amplitude: 1,
    scale: 100,
    resolution: 1000,
};

const App = () => {
    const canvasSize = 800;
    const [curveSettings, setCurveSettings] = useState(defaultCurveSettings);
    const [curveCoordinates, setCurveCoordinates] = useState([]);
    const [asymptoteCoordinates, setAsymptoteCoordinates] = useState([]);
    const [rotationAngle, setRotationAngle] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [pivotX, setPivotX] = useState(canvasSize / 2);
    const [pivotY, setPivotY] = useState(canvasSize / 2);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isDotAnimating, setIsDotAnimating] = useState(false);
    const [isAsymptote, setIsAsymptote] = useState(false);
    const [angle, setAngle] = useState(0);
    const [dotAngle, setDotAngle] = useState(0);

    const amplitudeRef = useRef(curveSettings.amplitude);
    const amplitudeDirectionRef = useRef(0.02);
    const requestRef = useRef(null);

    const maxAmplitude = 3;
    const minAmplitude = 1;

    const calculateCurvePoint = (a, angle, scale) => {
        const x = a * Math.tan(angle) * scale;
        const y = -a * Math.pow(Math.cos(angle), 2) * scale;
        return { x, y };
    };

    const calculateCurveDerivative = (a, angle, scale) => {
        const dx = a * Math.pow(1 / Math.cos(angle), 2) * scale;
        const dy = -2 * a * Math.sin(angle) * Math.cos(angle) * scale;
        const derivative = dx !== 0 ? dy / dx : 0;
        return derivative;
    };

    const calculateTangentAngle = (angle) => {
        const derivative = calculateCurveDerivative(curveSettings.amplitude, angle, curveSettings.scale);
        return Math.atan(derivative) * (180 / Math.PI);
    };

    const calculateParametricCurve = () => {
        const { amplitude: a, scale, resolution } = curveSettings;
        const newCoordinates = [];
        const centerX = canvasSize / 2;
        const centerY = canvasSize / 2;

        for (let i = -resolution; i <= resolution; i++) {
            const angle = (i / resolution) * (Math.PI / 2);
            const { x, y } = calculateCurvePoint(a, angle, scale);
            newCoordinates.push(['line', centerX + x, centerY - y]);
        }

        newCoordinates.push(['emptyPoint']);
        setCurveCoordinates(newCoordinates);

        const asymptoteNewCoordinates = [['asymptote', -99999, centerY], ['asymptote', 99999, centerY]];
        setAsymptoteCoordinates(asymptoteNewCoordinates);
    };

    useEffect(() => {
        calculateParametricCurve();
    }, [curveSettings, canvasSize]);

    const animateAmplitude = () => {
        amplitudeRef.current += amplitudeDirectionRef.current;

        if (amplitudeRef.current >= maxAmplitude) {
            amplitudeDirectionRef.current = -Math.abs(amplitudeDirectionRef.current);
        } else if (amplitudeRef.current <= minAmplitude) {
            amplitudeDirectionRef.current = Math.abs(amplitudeDirectionRef.current);
        }

        setCurveSettings((prev) => ({ ...prev, amplitude: amplitudeRef.current }));
        requestRef.current = requestAnimationFrame(animateAmplitude);
    };

    const animateDot = () => {
        setAngle((prevAngle) => prevAngle + 0.05);
        setDotAngle(calculateTangentAngle(angle));
        requestRef.current = requestAnimationFrame(animateDot);
    };

    const toggleAnimation = () => {
        if (isAnimating) {
            cancelAnimationFrame(requestRef.current);
        } else {
            requestRef.current = requestAnimationFrame(animateAmplitude);
        }
        setIsAnimating(!isAnimating);
    };

    const toggleDotAnimation = () => {
        if (isDotAnimating) {
            cancelAnimationFrame(requestRef.current);
        } else {
            requestRef.current = requestAnimationFrame(animateDot);
        }
        setIsDotAnimating(!isDotAnimating);
    };

    const applyTransformations = (coordinates) => {
        const radAngle = (rotationAngle * Math.PI) / 180;

        const transformedCoordinates = coordinates.map(([type, x, y]) => {
            const translatedX = x - pivotX;
            const translatedY = y - pivotY;

            const rotatedX = translatedX * Math.cos(radAngle) - translatedY * Math.sin(radAngle);
            const rotatedY = translatedX * Math.sin(radAngle) + translatedY * Math.cos(radAngle);

            return [
                type,
                rotatedX + pivotX + translateX,
                rotatedY + pivotY + translateY
            ];
        });

        return { coordinates: transformedCoordinates };
    };

    useEffect(() => {
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    const { coordinates: transformedCurveCoordinates } = applyTransformations(curveCoordinates);
    const { coordinates: transformedAsymptoteCoordinates } = applyTransformations(asymptoteCoordinates);

    return (
        <div>
            <SideMenu
                curveSettings={curveSettings}
                setCurveSettings={setCurveSettings}
                rotationAngle={rotationAngle}
                setRotationAngle={setRotationAngle}
                pivotX={pivotX}
                setPivotX={setPivotX}
                pivotY={pivotY}
                setPivotY={setPivotY}
                canvasSize={canvasSize}
                translateX={translateX}
                setTranslateX={setTranslateX}
                translateY={translateY}
                setTranslateY={setTranslateY}
                toggleAnimation={toggleAnimation}
                isAnimating={isAnimating}
                isAsymptote={isAsymptote}
                setIsAsymptote={setIsAsymptote}
                toggleDotAnimation={toggleDotAnimation}
            />

            <Dot
                canvasSize={canvasSize}
                dotCoordinates={{ x: 15, y: 395 }}
                angle={dotAngle}
            />

            <Shape
                coordinates={transformedCurveCoordinates}
                asymptoteCoordinates={isAsymptote ? transformedAsymptoteCoordinates : []}
                canvasSize={canvasSize}
            />

            <Graph
                pivot={{ x: pivotX, y: pivotY }}
                canvasSize={canvasSize}
            />
        </div>
    );
};

export default App;

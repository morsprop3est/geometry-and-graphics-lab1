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
    const [dotAngle, setDotAngle] = useState(0);
    const [dotPosition, setDotPosition] = useState({ x: -100, y: canvasSize / 2 });
    const [dotDirection, setDotDirection] = useState(1);

    const amplitudeRef = useRef(curveSettings.amplitude);
    const amplitudeDirectionRef = useRef(0.01);
    const angleRef = useRef(0);
    const requestRef = useRef(null);

    const maxAmplitude = 3;
    const minAmplitude = 1;

    const calculateCurvePoint = (a, angle, scale) => {
        const x = a * Math.tan(angle) * scale;
        const y = -a * Math.pow(Math.cos(angle), 2) * scale;
        return { x, y };
    };

    const calculateTangentAngle = (angle) => {
        const dx = curveSettings.amplitude * Math.pow(1 / Math.cos(angle), 2) * curveSettings.scale;
        const dy = 2 * curveSettings.amplitude * Math.sin(angle) * Math.cos(angle) * curveSettings.scale;
        const derivative = dx !== 0 ? dy / dx : 0;
        const tangentAngle = Math.atan(derivative); // Angle of tangent

        return tangentAngle - (rotationAngle * Math.PI) / 180; // Convert rotation to radians
    };


    const applyTransformations = (coordinates) => {
        const radAngle = (rotationAngle * Math.PI) / 180;
        return coordinates.map(([type, x, y]) => {
            const translatedX = x - pivotX;
            const translatedY = y - pivotY;
            const rotatedX = translatedX * Math.cos(radAngle) - translatedY * Math.sin(radAngle);
            const rotatedY = translatedX * Math.sin(radAngle) + translatedY * Math.cos(radAngle);
            return [type, rotatedX + pivotX + translateX, rotatedY + pivotY + translateY];
        });
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
        setCurveSettings((prevSettings) => {
            let newAmplitude = amplitudeRef.current + amplitudeDirectionRef.current;

            if (newAmplitude >= maxAmplitude || newAmplitude <= minAmplitude) {
                amplitudeDirectionRef.current *= -1;
            }

            amplitudeRef.current = newAmplitude;
            return { ...prevSettings, amplitude: newAmplitude };
        });
        requestRef.current = requestAnimationFrame(animateAmplitude);
    };

    const animateDot = () => {
        angleRef.current += 0.01 * dotDirection;
        if (angleRef.current > Math.PI / 2 || angleRef.current < -Math.PI / 2) {
            setDotDirection(dotDirection * -1);
            angleRef.current = Math.sign(dotDirection) * Math.PI / 2;
        }

        const { x, y } = calculateCurvePoint(curveSettings.amplitude, angleRef.current, curveSettings.scale);
        const centerX = canvasSize / 2;
        const centerY = canvasSize / 2;

        const originalX = centerX + x;
        const originalY = centerY - y;

        const radAngle = (rotationAngle * Math.PI) / 180;
        const translatedX = originalX - pivotX;
        const translatedY = originalY - pivotY;

        const rotatedX = translatedX * Math.cos(radAngle) - translatedY * Math.sin(radAngle);
        const rotatedY = translatedX * Math.sin(radAngle) + translatedY * Math.cos(radAngle);

        const finalX = rotatedX + pivotX + translateX;
        const finalY = canvasSize - (rotatedY + pivotY + translateY);

        setDotAngle(calculateTangentAngle(angleRef.current));
        setDotPosition({ x: finalX, y: finalY });

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

    useEffect(() => {
        const { x, y } = calculateCurvePoint(curveSettings.amplitude, angleRef.current, curveSettings.scale);
        const centerX = canvasSize / 2;
        const centerY = canvasSize / 2;

        const originalX = centerX + x;
        const originalY = centerY - y;

        const radAngle = (rotationAngle * Math.PI) / 180;
        const translatedX = originalX - pivotX;
        const translatedY = originalY - pivotY;

        const rotatedX = translatedX * Math.cos(radAngle) - translatedY * Math.sin(radAngle);
        const rotatedY = translatedX * Math.sin(radAngle) + translatedY * Math.cos(radAngle);

        const finalX = rotatedX + pivotX + translateX;
        const finalY = canvasSize - (rotatedY + pivotY + translateY);

        setDotPosition({ x: finalX, y: finalY });
    }, [curveSettings.amplitude, curveSettings.scale, rotationAngle, pivotX, pivotY, translateX, translateY]);

    const transformedCurveCoordinates = applyTransformations(curveCoordinates);
    const transformedAsymptoteCoordinates = applyTransformations(asymptoteCoordinates);

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
                dotCoordinates={dotPosition}
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

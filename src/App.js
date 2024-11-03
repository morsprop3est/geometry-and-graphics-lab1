import React, { useState, useEffect, useRef } from 'react';
import Shape from './components/Shape/Shape';
import Graph from './components/Graph/Graph';
import Dot from './components/Dot/Dot';
import SideMenu from './components/SideMenu/SideMenu';

const defaultCurveSettings = {
    amplitude: 100,
    scale: 1,
};

const App = () => {
    const canvasSize = 800;
    const resolution = 2000;
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
    const [isAsymptoteVisible, setIsAsymptoteVisible] = useState(false);
    const [isTangentVisible, setIsTangentVisible] = useState(false);
    const [isNormalVisible, setIsNormalVisible] = useState(false);
    const [dotAngle, setDotAngle] = useState(0);
    const [dotPosition, setDotPosition] = useState({ x: -100, y: canvasSize / 2 });
    const [dotDirection, setDotDirection] = useState(1);
    const [curveMetrics, setCurveMetrics] = useState({
        arcLength: 0,
        area: 0,
        radiusOfCurvature: 0,
    });

    const [lineStartX, setLineStartX] = useState(100);
    const [lineEndX, setLineEndX] = useState(110);

    const amplitudeRef = useRef(curveSettings.amplitude);
    const amplitudeDirectionRef = useRef(1);
    const angleRef = useRef(0);
    const requestRef = useRef(null);

    const maxAmplitude = 300;
    const minAmplitude = 100;

    const calculateCurvePoint = (a, angle, scale) => {
        const x = a * Math.tan(angle) * scale;
        const y = -a * Math.pow(Math.cos(angle), 2) * scale;
        return { x, y };
    };

    const calculateTangentAngle = (angle) => {
            const dx = curveSettings.amplitude * Math.pow(1 / Math.cos(angle), 2) * curveSettings.scale;
            const dy = 2 * curveSettings.amplitude * Math.sin(angle) * Math.cos(angle) * curveSettings.scale;
        const derivative = dx !== 0 ? dy / dx : 0;
        const tangentAngle = Math.atan(derivative);

        return tangentAngle - (rotationAngle * Math.PI) / 180;
    };

    const calculateArea = () => {
        const { amplitude: a, scale } = curveSettings;
        let area = 0;
        const centerX = canvasSize / 2;
        const centerY = canvasSize / 2;


        const startX = lineStartX - centerX;
        const endX = lineEndX - centerX;


        const segments = 1000;
        const deltaX = (endX - startX) / segments;

        for (let i = 0; i < segments; i++) {
            const x = startX + i * deltaX;

            const angle = Math.atan2(-x / scale, a / scale);

            const y = -a * Math.pow(Math.cos(angle), 2) * scale;

            area += Math.abs(y) * deltaX / 10;
        }

        setCurveMetrics((prev) => ({ ...prev, area }));
    };

    useEffect(() => {
        calculateArea();
    }, [curveSettings, lineStartX, lineEndX]);



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
        const { amplitude: a, scale } = curveSettings;
        const newCoordinates = [];
        const centerX = canvasSize / 2;
        const centerY = canvasSize / 2;

        for (let i = -Math.PI / 2; i <= Math.PI / 2; i += (Math.PI / (2 * resolution))) {
            const { x, y } = calculateCurvePoint(a, i, scale);
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
        angleRef.current += 0.005 * dotDirection;
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

        calculateRadiusOfCurvature(angleRef.current);

        requestRef.current = requestAnimationFrame(animateDot);
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

        const tangentAngle = calculateTangentAngle(angleRef.current);

        setDotPosition({ x: finalX, y: finalY });
        setDotAngle(tangentAngle);

        calculateRadiusOfCurvature(angleRef.current);
    }, [curveSettings.amplitude, curveSettings.scale, rotationAngle, pivotX, pivotY, translateX, translateY]);


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

        const tangentAngle = calculateTangentAngle(angleRef.current);

        setDotPosition({ x: finalX, y: finalY });
        setDotAngle(tangentAngle);
    }, [curveSettings.amplitude, curveSettings.scale, rotationAngle, pivotX, pivotY, translateX, translateY]);


    const transformedCurveCoordinates = applyTransformations(curveCoordinates);
    const transformedAsymptoteCoordinates = applyTransformations(asymptoteCoordinates);

    const calculateArcLength = () => {
        const { amplitude: a, scale } = curveSettings;
        let length = 0;
        let prevPoint = calculateCurvePoint(a, -Math.PI / 2, scale);

        for (let i = -resolution; i <= resolution; i++) {
            const angle = (i / resolution) * (Math.PI / 2);
            const point = calculateCurvePoint(a, angle, scale);

            const centerX = canvasSize / 2;
            const centerY = canvasSize / 2;
            const x = centerX + point.x;
            const y = centerY - point.y;

            if (x < lineStartX || x > lineEndX) {
                prevPoint = point;
                continue;
            }

            const dx = point.x - prevPoint.x;
            const dy = point.y - prevPoint.y;

            length += Math.sqrt(dx ** 2 + dy ** 2);
            prevPoint = point;
        }

        console.log(`Calculated Arc Length: ${length}`);
        setCurveMetrics((prev) => ({ ...prev, arcLength: length }));
    };

    const calculateRadiusOfCurvature = (angle) => {
        const { amplitude: a, scale } = curveSettings;

        const dx = a * Math.pow(1 / Math.cos(angle), 2) * scale;
        const dy = -2 * a * Math.cos(angle) * Math.sin(angle) * scale;

        const d2x = 2 * a * Math.sin(angle) * scale;
        const d2y = -2 * a * (Math.cos(2 * angle)) * scale;

        const numerator = Math.pow(dx ** 2 + dy ** 2, 1.5);
        const denominator = Math.abs(dx * d2y - dy * d2x);

        const radiusOfCurvature = denominator !== 0 ? numerator / denominator : Infinity;

        setCurveMetrics((prev) => ({ ...prev, radiusOfCurvature }));
    };

    useEffect(() => {
        calculateParametricCurve();
        calculateArcLength();
        calculateRadiusOfCurvature(Math.PI / 4);
        calculateArea();
    }, [curveSettings, lineStartX, lineEndX]);

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
                isAsymptoteVisible={isAsymptoteVisible}
                setIsAsymptoteVisible={setIsAsymptoteVisible}
                toggleDotAnimation={toggleDotAnimation}
                curveMetrics={curveMetrics}
                lineStartX={lineStartX}
                lineEndX={lineEndX}
                setLineStartX={setLineStartX}
                setLineEndX={setLineEndX}
                isTangentVisible={isTangentVisible}
                setIsTangentVisible={setIsTangentVisible}
                isNormalVisible={isNormalVisible}
                setIsNormalVisible={setIsNormalVisible}
            />
            <Dot
                canvasSize={canvasSize}
                dotCoordinates={dotPosition}
                angle={dotAngle}
                isTangentVisible={isTangentVisible}
                isNormalVisible={isNormalVisible}
            />
            <Shape
                coordinates={transformedCurveCoordinates}
                asymptoteCoordinates={isAsymptoteVisible ? transformedAsymptoteCoordinates : []}
                canvasSize={canvasSize}
            />
            <Graph
                pivot={{ x: pivotX, y: pivotY }}
                canvasSize={canvasSize}
                lineStartX={lineStartX}
                lineEndX={lineEndX}
            />
        </div>
    );
};

export default App;

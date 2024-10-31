import React, { useState, useEffect } from 'react';
import Shape from './components/Shape/Shape';
import Graph from './components/Graph/Graph';
import SideMenu from './components/SideMenu/SideMenu';
import { rotateShape, translateShape } from './utils/utils';

const defaultCurveSettings = {
    amplitude: 1,
    scale: 100,
    resolution: 50,
};

const App = () => {
    const canvasSize = 800;
    const [curveSettings, setCurveSettings] = useState(defaultCurveSettings);
    const [curveCoordinates, setCurveCoordinates] = useState([]);
    const [rotationAngle, setRotationAngle] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [pivotX, setPivotX] = useState(canvasSize / 2);
    const [pivotY, setPivotY] = useState(canvasSize / 2);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationInterval, setAnimationInterval] = useState(null);
    const [amplitudeStep, setAmplitudeStep] = useState(0.05);
    const maxAmplitude = 5;
    const minAmplitude = 1;

    const calculateVersieraCurve = () => {
        const { amplitude, scale, resolution } = curveSettings;
        const newCoordinates = [];
        const centerX = canvasSize / 2;
        const centerY = canvasSize / 2;

        for (let i = -resolution; i <= resolution; i++) {
            const x = (i / resolution) * scale;
            const y = (amplitude / (1 + (x / scale) ** 2)) * scale;
            newCoordinates.push(['line', centerX + x, centerY - y]);
        }

        setCurveCoordinates(newCoordinates);
    };

    useEffect(() => {
        calculateVersieraCurve();
    }, [curveSettings, canvasSize]);

    const startAnimation = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            const intervalId = setInterval(() => {
                setCurveSettings((prev) => {
                    const newAmplitude = prev.amplitude + amplitudeStep;

                    if (newAmplitude >= maxAmplitude) {
                        setAmplitudeStep(-Math.abs(amplitudeStep));
                        return { ...prev, amplitude: maxAmplitude };
                    } else if (newAmplitude <= minAmplitude) {
                        setAmplitudeStep(Math.abs(amplitudeStep));
                        return { ...prev, amplitude: minAmplitude };
                    }

                    return { ...prev, amplitude: newAmplitude };
                });
            }, 50);

            setAnimationInterval(intervalId);
        }
    };

    const stopAnimation = () => {
        if (isAnimating) {
            clearInterval(animationInterval);
            setIsAnimating(false);
        }
    };

    const toggleAnimation = () => {
        if (isAnimating) {
            stopAnimation();
        } else {
            startAnimation();
        }
    };

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
                onRotate={() => rotateShape(curveCoordinates, rotationAngle, pivotX, pivotY, setCurveCoordinates)}
                canvasSize={canvasSize}
                translateX={translateX}
                setTranslateX={setTranslateX}
                translateY={translateY}
                setTranslateY={setTranslateY}
                onTranslate={() => translateShape(curveCoordinates, translateX, translateY, setCurveCoordinates)}
                toggleAnimation={toggleAnimation}
                isAnimating={isAnimating}
            />
            <Shape coordinates={curveCoordinates} canvasSize={canvasSize} />
            <Graph
                pivot={{ x: pivotX, y: pivotY }}
                canvasSize={canvasSize}
            />
        </div>
    );
};

export default App;

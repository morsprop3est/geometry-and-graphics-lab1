import React, { useState } from 'react';
import Shape from './components/Shape/Shape';
import Graph from './components/Graph/Graph';
import SideMenu from './components/SideMenu/SideMenu';

const defaultGridSettings = {
    gridSize: 20,
    gridDensity: 2,
    gridColor: '#cccccc',
    canvasSize: 800,
};

const defaultIFSCoefficients = [
    { a: 0.787879, b: -0.424242, c: 0.242424, d: 0.859848, e: 1.758647, f: 1.408065, p: 0.895652 },
    { a: -0.121212, b: 0.257576, c: 0.151515, d: 0.053030, e: -6.721654, f: 1.377236, p: 0.052174 },
    { a: 0.181818, b: -0.136364, c: 0.090909, d: 0.181818, e: 6.086107, f: 1.568035, p: 0.052174 },
];

const App = () => {
    const [gridSize, setGridSize] = useState(defaultGridSettings.gridSize);
    const [gridDensity, setGridDensity] = useState(defaultGridSettings.gridDensity);
    const [gridColor, setGridColor] = useState(defaultGridSettings.gridColor);
    const [canvasSize, setCanvasSize] = useState(defaultGridSettings.canvasSize);

    const [showPoints, setShowPoints] = useState(true);
    const [showLines, setShowLines] = useState(true);
    const [scaleX, setScaleX] = useState(1);
    const [scaleY, setScaleY] = useState(1);
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [rotate, setRotate] = useState(0);
    const [pivotX, setPivotX] = useState(0);
    const [pivotY, setPivotY] = useState(0);

    const [ifsCoefficients, setIfsCoefficients] = useState(defaultIFSCoefficients);
    const [iterations, setIterations] = useState(100000);

    const setPivotPosition = (x, y) => {
        setPivotX(x);
        setPivotY(y);
    };

    return (
        <div>
            <SideMenu
                gridSize={gridSize}
                setGridSize={setGridSize}
                gridDensity={gridDensity}
                setGridDensity={setGridDensity}
                gridColor={gridColor}
                setGridColor={setGridColor}
                canvasSize={canvasSize}
                setCanvasSize={setCanvasSize}
                setShowPoints={setShowPoints}
                setShowLines={setShowLines}
                showPoints={showPoints}
                showLines={showLines}
                scaleX={scaleX}
                setScaleX={setScaleX}
                scaleY={scaleY}
                setScaleY={setScaleY}
                translateX={translateX}
                setTranslateX={setTranslateX}
                translateY={translateY}
                setTranslateY={setTranslateY}
                rotate={rotate}
                setRotate={setRotate}
                pivotX={pivotX}
                setPivotX={setPivotX}
                pivotY={pivotY}
                setPivotY={setPivotY}
                ifsCoefficients={ifsCoefficients}
                setIfsCoefficients={setIfsCoefficients}
                iterations={iterations}
                setIterations={setIterations}
            />
            <Shape
                canvasSize={canvasSize}
                scaleX={scaleX}
                scaleY={scaleY}
                translateX={translateX}
                translateY={translateY}
                rotate={rotate}
                pivotX={pivotX}
                pivotY={pivotY}
                setPivotPosition={setPivotPosition}
                ifsCoefficients={ifsCoefficients}
                iterations={iterations}
            />
            <Graph
                gridSize={gridSize}
                gridDensity={gridDensity}
                gridColor={gridColor}
                canvasSize={canvasSize}
            />
        </div>
    );
};

export default App;

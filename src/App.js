import React, { useState } from 'react';
import Graph from './components/Graph/Graph';
import Shape from './components/Graph/Shape';
import SideMenu from './components/SideMenu/SideMenu';
import styles from './App.scss';

const App = () => {
    const defaultCanvasWidth = 1200;
    const defaultCanvasHeight = 600;
    const defaultGridSize = 20;

    const [canvasWidth, setCanvasWidth] = useState(defaultCanvasWidth);
    const [canvasHeight, setCanvasHeight] = useState(defaultCanvasHeight);
    const [gridSize, setGridSize] = useState(defaultGridSize);

    const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    const defaultCoordinates = [
        { radius: 20, center: { x: -100, y: 100 }, startAngle: degreesToRadians(450), endAngle: degreesToRadians(360), counterclockwise: true },
        { radius: 20, center: { x: 0, y: 100 }, startAngle: degreesToRadians(180), endAngle: degreesToRadians(0), counterclockwise: false },
        { radius: 20, center: { x: 100, y: 100 }, startAngle: degreesToRadians(180), endAngle: degreesToRadians(90), counterclockwise: true },
        { radius: 20, center: { x: 100, y: -100 }, startAngle: degreesToRadians(270), endAngle: degreesToRadians(180), counterclockwise: true },
        { radius: 20, center: { x: 0, y: -100 }, startAngle: degreesToRadians(360), endAngle: degreesToRadians(180), counterclockwise: false },
        { radius: 20, center: { x: -100, y: -100 }, startAngle: degreesToRadians(360), endAngle: degreesToRadians(270), counterclockwise: true },
    ];



    const [shapeCoordinates, setShapeCoordinates] = useState(defaultCoordinates);

    const resetShape = () => {
        setShapeCoordinates(defaultCoordinates);
    };

    const resetGrid = () => {
        setCanvasWidth(defaultCanvasWidth);
        setCanvasHeight(defaultCanvasHeight);
        setGridSize(defaultGridSize);
    };

    return (
        <div className={styles.app}>
            <div className={styles.canvasWrapper}>
                <Graph
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                    gridSize={gridSize}
                />
                <Shape
                    shapeCoordinates={shapeCoordinates}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                />
            </div>
            <SideMenu
                shapeCoordinates={shapeCoordinates}
                setShapeCoordinates={setShapeCoordinates}
                onResetShape={resetShape}
                onResetGrid={resetGrid}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                gridSize={gridSize}
                setCanvasWidth={setCanvasWidth}
                setCanvasHeight={setCanvasHeight}
                setGridSize={setGridSize}
            />
        </div>
    );
};

export default App;

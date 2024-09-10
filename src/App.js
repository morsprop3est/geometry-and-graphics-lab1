import React, { useState } from 'react';

import Graph from './components/Graph/Graph';
import Shape from './components/Graph/Shape';
import SideMenu from './components/SideMenu/SideMenu';

import styles from './App.scss';

const App = () => {
    const defaultCanvasWidth = 1200;
    const defaultCanvasHeight = 600;
    const defaultGridSize = 20;

    const defaultCoordinates = [
        { x: 200, y: 200 },
        { x: 400, y: 200 },
        { x: 400, y: 400 },
        { x: 200, y: 400 }
    ];

    const [shapeCoordinates, setShapeCoordinates] = useState(defaultCoordinates);
    const [canvasWidth, setCanvasWidth] = useState(defaultCanvasWidth);
    const [canvasHeight, setCanvasHeight] = useState(defaultCanvasHeight);
    const [gridSize, setGridSize] = useState(defaultGridSize);

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

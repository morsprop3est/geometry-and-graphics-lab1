import React, { useState, useEffect } from 'react';
import Shape from './components/Shape/Shape';
import Graph from './components/Graph/Graph';
import SideMenu from './components/SideMenu/SideMenu';
import { applySymmetryTransformations } from './utils/utils';

const defaultShapeElements = [
    { id: 1, type: 'arc', startX: 27.5, startY: 65, endX: 10, endY: 0, controlX: 20, controlY: 130 },
    { id: 2, type: 'arc', startX: 50, startY: 50, endX: 100, endY: 100, controlX: 30, controlY: 50 },
    { id: 3, type: 'arc', startX: 120, startY: 120, endX: 150, endY: 50, controlX: 120, controlY: 90 },
];

const defaultGridSettings = {
    gridSize: 20,
    gridDensity: 2,
    gridColor: '#cccccc',
    canvasSize: 800,
};

const App = () => {
    const [elements, setElements] = useState(defaultShapeElements);
    const [gridSize, setGridSize] = useState(defaultGridSettings.gridSize);
    const [gridDensity, setGridDensity] = useState(defaultGridSettings.gridDensity);
    const [gridColor, setGridColor] = useState(defaultGridSettings.gridColor);
    const [canvasSize, setCanvasSize] = useState(defaultGridSettings.canvasSize);
    const [showPoints, setShowPoints] = useState(true);
    const [showLines, setShowLines] = useState(true);

    const updateElementPosition = (id, pointType, x, y) => {
        setElements((prevElements) =>
            prevElements.map((element) =>
                element.id === id
                    ? {
                        ...element,
                        [`${pointType}X`]: x,
                        [`${pointType}Y`]: y,
                    }
                    : element
            )
        );
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
            />
            <Shape
                elements={elements}
                canvasSize={canvasSize}
                updateElementPosition={updateElementPosition}
                showPoints={showPoints}
                showLines={showLines}
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

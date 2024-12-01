import React, { useState, useEffect } from 'react';
import Shape from './components/Shape/Shape';
import Graph from './components/Graph/Graph';
import SideMenu from './components/SideMenu/SideMenu';
import shapesData from './shapeData.json';

const defaultGridSettings = {
    gridSize: 20,
    gridDensity: 2,
    gridColor: '#cccccc',
    canvasSize: 800,
};

const App = () => {
    const [elements, setElements] = useState(shapesData.shape1)
    const [isShape1, setIsShape1] = useState(true);
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

    const processElements = (elements) => {
        return elements.map((element, index, arr) => {
            const nextElement = arr[index + 1] || arr[0];

            return {
                ...element,
                endX: element.endX ?? nextElement.startX,
                endY: element.endY ?? nextElement.startY,
            };
        });
    };


    const toggleShapeTransformation = () => {
        const targetElements = isShape1 ? shapesData.shape2 : shapesData.shape1;
        animateShapeTransition(elements, targetElements);
        setIsShape1(!isShape1);
    };

    const animateShapeTransition = (startElements, endElements) => {

    };

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

    const saveShapeData = () => {
        const processedShape1 = processElements(elements);
        const processedShape2 = processElements(shapesData.shape2);

        const jsonData = JSON.stringify({
            shape1: processedShape1,
            shape2: processedShape2,
        }, null, 2);

        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'shapeData.json';
        a.click();
        URL.revokeObjectURL(url);
    };



    const addArc = () => {
        const newArc = {
            id: elements.length + 1,
            type: 'arc',
            startX: 100,
            startY: 100,
            controlX: 200,
            controlY: 200,
        };

        setElements((prevElements) => [...prevElements, newArc]);
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
                toggleTransformation={toggleShapeTransformation}
                saveShapeData={saveShapeData}
                addArc={addArc}
                scaleX={scaleX}
                scaleY={scaleY}
                setScaleX={setScaleX}
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
            />
            <Shape
                elements={elements}
                canvasSize={canvasSize}
                updateElementPosition={updateElementPosition}
                showPoints={showPoints}
                showLines={showLines}
                scaleX={scaleX}
                scaleY={scaleY}
                translateX={translateX}
                translateY={translateY}
                rotate={rotate}
                pivotX={pivotX}
                pivotY={pivotY}
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

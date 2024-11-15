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
    const [elements, setElements] = useState(shapesData.shape1); // Start with shape1
    const [isShape1, setIsShape1] = useState(true); // Track which shape is active
    const [gridSize, setGridSize] = useState(defaultGridSettings.gridSize);
    const [gridDensity, setGridDensity] = useState(defaultGridSettings.gridDensity);
    const [gridColor, setGridColor] = useState(defaultGridSettings.gridColor);
    const [canvasSize, setCanvasSize] = useState(defaultGridSettings.canvasSize);
    const [showPoints, setShowPoints] = useState(true);
    const [showLines, setShowLines] = useState(true);

    const toggleShapeTransformation = () => {
        const targetElements = isShape1 ? shapesData.shape2 : shapesData.shape1;
        animateShapeTransition(elements, targetElements);
        setIsShape1(!isShape1);
    };

    const animateShapeTransition = (startElements, endElements) => {
        if (!Array.isArray(startElements) || !Array.isArray(endElements)) {
            console.error('Invalid shape data: startElements or endElements is not an array');
            return;
        }

        const steps = 60;
        const duration = 1000;
        const interval = duration / steps;
        let stepCount = 0;

        const interpolate = (start, end, progress) => start + (end - start) * progress;

        const animate = () => {
            stepCount++;
            const progress = stepCount / steps;

            const newElements = startElements.map((startElement, index) => {
                const endElement = endElements[index];
                if (!endElement) return startElement;

                return {
                    ...startElement,
                    startX: interpolate(startElement.startX, endElement.startX, progress),
                    startY: interpolate(startElement.startY, endElement.startY, progress),
                    endX: interpolate(startElement.endX, endElement.endX, progress),
                    endY: interpolate(startElement.endY, endElement.endY, progress),
                    controlX: interpolate(startElement.controlX, endElement.controlX, progress),
                    controlY: interpolate(startElement.controlY, endElement.controlY, progress),
                };
            });

            setElements(newElements);

            if (stepCount < steps) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
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

    // Save both shape1 and shape2 data when the user clicks save
    const saveShapeData = () => {
        // Save both shapes, with the current one as elements
        const jsonData = JSON.stringify({
            shape1: elements, // This is the active shape's data
            shape2: isShape1 ? shapesData.shape2 : shapesData.shape1, // Save the other shape
        }, null, 2);

        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'shapeData.json';
        a.click();

        URL.revokeObjectURL(url);
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

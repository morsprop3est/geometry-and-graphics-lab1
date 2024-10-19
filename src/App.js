import React, { useState, useEffect } from 'react';
import Shape from './components/Shape/Shape';
import Graph from './components/Graph/Graph';
import SideMenu from './components/SideMenu/SideMenu';
import { calculateArc, scaleShape, rotateShape, translateShape, applyAffineTransformations } from './utils/utils';

const defaultShapeElements = [
    { type: 'point', x: 100, y: 100 },
    { type: 'point', x: 200, y: 100 },
    { type: 'point', x: 200, y: 200 },
    { type: 'arc', centerX: 150, centerY: 150, radius: 50, startAngle: 0, endAngle: -90 },
    { type: 'point', x: 200, y: 200 },
    { type: 'arc', centerX: 100, centerY: 150, radius: 50, startAngle: -90, endAngle: -270 },
    { type: 'point', x: 200, y: 200 },
];

const defaultAffineMatrix = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
];

const defaultGridSettings = {
    gridSize: 20,
    gridDensity: 1,
    gridColor: '#cccccc',
    canvasSize: 800,
};

const App = () => {
    const [shapeElements, setShapeElements] = useState(defaultShapeElements);
    const [affineMatrix, setAffineMatrix] = useState(defaultAffineMatrix);
    const [rotationAngle, setRotationAngle] = useState(0);
    const [scaleX, setScaleX] = useState(1);
    const [scaleY, setScaleY] = useState(1);
    const [pivotX, setPivotX] = useState(0);
    const [pivotY, setPivotY] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [gridSize, setGridSize] = useState(defaultGridSettings.gridSize);
    const [gridDensity, setGridDensity] = useState(defaultGridSettings.gridDensity);
    const [gridColor, setGridColor] = useState(defaultGridSettings.gridColor);
    const [canvasSize, setCanvasSize] = useState(defaultGridSettings.canvasSize);
    const [gridCoordinates, setGridCoordinates] = useState([]);
    const [isTransformed, setIsTransformed] = useState(false);


    const [shapeCoordinates, setShapeCoordinates] = useState(() => {
        return shapeElements.flatMap((element) => {
            if (element.type === 'point') {
                return [['line', element.x, element.y]];
            } else if (element.type === 'arc') {
                return calculateArc(
                    element.centerX,
                    element.centerY,
                    element.radius,
                    element.startAngle,
                    element.endAngle,
                    20
                );
            }
            return [];
        });
    });

    const updateShapeCoordinates = () => {
        const updatedCoordinates = shapeElements.flatMap((element) => {
            if (element.type === 'point') {
                return [['line', element.x, element.y]];
            } else if (element.type === 'arc') {
                return calculateArc(
                    element.centerX,
                    element.centerY,
                    element.radius,
                    element.startAngle,
                    element.endAngle,
                    20
                );
            }
            return [];
        });
        setShapeCoordinates(updatedCoordinates);
    };

    const calculateGridLines = () => {
        const lines = [];
        const step = gridSize / gridDensity;
        const halfWidth = canvasSize / 2;
        const halfHeight = canvasSize / 2;

        for (let x = -halfWidth; x <= halfWidth; x += step) {
            lines.push({
                type: 'vertical',
                start: { x: halfWidth + x, y: 0 },
                end: { x: halfWidth + x, y: canvasSize },
            });
        }

        for (let y = -halfHeight; y <= halfHeight; y += step) {
            lines.push({
                type: 'horizontal',
                start: { x: 0, y: halfHeight - y },
                end: { x: canvasSize, y: halfHeight - y },
            });
        }

        return lines.flatMap((line) => {
            return [
                ['line', line.start.x, line.start.y],
                ['line', line.end.x, line.end.y],
            ];
        });
    };

    const updateGridCoordinates = () => {
        const lines = calculateGridLines();
        setGridCoordinates(lines);
    };

    const applyTranslation = () => {
        translateShape(shapeCoordinates, translateX, translateY, setShapeCoordinates);
    };

    const applyAffineTransformation = () => {
        const transformedCoordinates = applyAffineTransformations(shapeCoordinates, affineMatrix);
        setShapeCoordinates(transformedCoordinates);
        setIsTransformed(true); // Set transformed state
    };

    const applyAffineToGrid = () => {
        const transformedGridCoords = applyAffineTransformations(gridCoordinates, affineMatrix);
        setGridCoordinates(transformedGridCoords);
    };

    const resetTransformations = () => {
        setRotationAngle(0);
        setScaleX(1);
        setScaleY(1);
        setPivotX(0);
        setPivotY(0);
        setAffineMatrix(defaultAffineMatrix);
    };

    const resetGridSettings = () => {
        setGridSize(defaultGridSettings.gridSize);
        setGridDensity(defaultGridSettings.gridDensity);
        setGridColor(defaultGridSettings.gridColor);
        setCanvasSize(defaultGridSettings.canvasSize);
        updateGridCoordinates();
    };

    const resetShapeCoordinates = () => {
        setShapeElements(defaultShapeElements);
        updateShapeCoordinates();
    };

    useEffect(() => {
        updateGridCoordinates();
    }, [gridSize, gridDensity, canvasSize]);

    return (
        <div>
            <SideMenu
                shapeElements={shapeElements}
                setShapeElements={setShapeElements}
                rotationAngle={rotationAngle}
                setRotationAngle={setRotationAngle}
                scaleX={scaleX}
                scaleY={scaleY}
                setScaleX={setScaleX}
                setScaleY={setScaleY}
                pivotX={pivotX}
                pivotY={pivotY}
                setPivotX={setPivotX}
                setPivotY={setPivotY}
                onScale={() => scaleShape(shapeCoordinates, scaleX, scaleY, setShapeCoordinates)}
                onRotate={() => rotateShape(shapeCoordinates, rotationAngle, pivotX, pivotY, setShapeCoordinates)}
                updateShapeCoordinates={updateShapeCoordinates}
                gridSize={gridSize}
                setGridSize={setGridSize}
                gridDensity={gridDensity}
                setGridDensity={setGridDensity}
                gridColor={gridColor}
                setGridColor={setGridColor}
                canvasSize={canvasSize}
                setCanvasSize={setCanvasSize}
                resetTransformations={resetTransformations}
                resetShapeCoordinates={resetShapeCoordinates}
                resetGridSettings={resetGridSettings}
                translateX={translateX}
                setTranslateX={setTranslateX}
                translateY={translateY}
                setTranslateY={setTranslateY}
                onTranslate={applyTranslation}
                affineMatrix={affineMatrix}
                setAffineMatrix={setAffineMatrix}
                onApplyAffine={applyAffineTransformation}
                onApplyAffineToGrid={applyAffineToGrid}
            />
            <Shape
                coordinates={shapeCoordinates}
                canvasSize={canvasSize}
            />
            <Graph
                pivot={isTransformed ? null : { x: pivotX, y: pivotY }}
                gridSize={gridSize}
                gridDensity={gridDensity}
                gridColor={gridColor}
                canvasSize={canvasSize}
                affineMatrix={affineMatrix}
                gridCoordinates={gridCoordinates}
            />
        </div>
    );
};

export default App;

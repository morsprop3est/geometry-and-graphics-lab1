import React, { useState, useEffect } from 'react';
import Shape from './components/Shape/Shape';
import Graph from './components/Graph/Graph';
import SideMenu from './components/SideMenu/SideMenu';
import {
    calculateArc,
    scaleShape,
    rotateShape,
    translateShape,
    applyAffineTransformations,
    applySymmetryTransformations,
    applyProjectiveTransformations,
} from './utils/utils';

const defaultShapeElements = [
    { type: 'arc', centerX: 27.5, centerY: 65, radius: 10, startAngle: 0, endAngle: 180 },
    { type: 'arc', centerX: 0, centerY: 65, radius: 10, startAngle: 0, endAngle: -90 },
    { type: 'arc', centerX: 0, centerY: 10, radius: 10, startAngle: 90, endAngle: 0 },
    { type: 'arc', centerX: 27.5, centerY: 10, radius: 10, startAngle: -180, endAngle: 0 },
    { type: 'arc', centerX: 55, centerY: 10, radius: 10, startAngle: 180, endAngle: 90 },
    { type: 'arc', centerX: 55, centerY: 65, radius: 10, startAngle: -90, endAngle: -180 },


    { type: 'emptyPoint' },
    { type: 'arc', centerX: 27.5, centerY: 65, radius: 5, startAngle: 0, endAngle: 180 },
    { type: 'arc', centerX: 27.5, centerY: 37.5, radius: 13, startAngle: -247, endAngle: -113 },
    { type: 'arc', centerX: 27.5, centerY: 10, radius: 5, startAngle: 180, endAngle: 360 },
    { type: 'arc', centerX: 27.5, centerY: 37.5, radius: 13, startAngle: -67, endAngle: 67 },

];


const defaultAffineMatrix = [
    [30, 20, 0],
    [0, 10, 0],
    [0, 0, 10]];


const defaultProjectiveMatrix = [
    [150, 0, 3],
    [0, 200, 6],
    [0, 0, 500]];

const defaultGridSettings = {
    gridSize: 20,
    gridDensity: 2,
    gridColor: '#cccccc',
    canvasSize: 800,
};

const App = () => {
    const [shapeElements, setShapeElements] = useState(defaultShapeElements);
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
    const [affineMatrix, setAffineMatrix] = useState(defaultAffineMatrix);
    const [projectiveMatrix, setProjectiveMatrix] = useState(defaultProjectiveMatrix);
    const [gridCoordinates, setGridCoordinates] = useState([]);
    const [isTransformed, setIsTransformed] = useState(false);
    const [shapeCoordinates, setShapeCoordinates] = useState([]);


    useEffect(() => {
        updateShapeCoordinates();
    }, [shapeElements, gridSize]);

    const [defaultGridSize] = useState(defaultGridSettings.gridSize);

    const updateShapeCoordinates = () => {
        const updatedCoordinates = [];
        let currentShape = [];

        shapeElements.forEach((element) => {
            if (element.type === 'point') {
                currentShape.push(['line', element.x  * (gridSize / defaultGridSize), element.y  * (gridSize / defaultGridSize)]);
            } else if (element.type === 'arc') {
                const arcPoints = calculateArc(
                    element.centerX * (gridSize / defaultGridSize),
                    element.centerY * (gridSize / defaultGridSize),
                    element.radius * (gridSize / defaultGridSize),
                    element.startAngle,
                    element.endAngle,
                    20
                );
                updatedCoordinates.push(...arcPoints);
            } else if (element.type === 'emptyPoint') {
                if (currentShape.length > 0) {
                    updatedCoordinates.push(['line', currentShape[0][1], currentShape[0][2]]);
                    currentShape = [];
                }
                updatedCoordinates.push(['emptyPoint']);
            }
        });

        if (currentShape.length > 0) {
            updatedCoordinates.push(...currentShape);
        }

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
                start: { x: 0, y: halfHeight + y },
                end: { x: canvasSize, y: halfHeight + y },
            });
        }

        return lines.flatMap((line) => [
            ['line', line.start.x, line.start.y],
            ['line', line.end.x, line.end.y],
        ]);
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
        setIsTransformed(true);
    };

    const applySymmetryTransformation = () => {
        applySymmetryTransformations(shapeCoordinates, { x: pivotX * (gridSize / defaultGridSize), y: pivotY * (gridSize / defaultGridSize) }, setShapeCoordinates);
    };


    const applyProjectiveTransformation = () => {
        const transformedCoordinates = applyProjectiveTransformations(shapeCoordinates, projectiveMatrix);
        setShapeCoordinates(transformedCoordinates);
        setIsTransformed(true);
    };

    const applyAffineToGrid = () => {
        const transformedGridCoords = applyAffineTransformations(gridCoordinates, affineMatrix);
        setGridCoordinates(transformedGridCoords);
    };

    const applyProjectiveToGrid = () => {
        const transformedGridCoords = applyProjectiveTransformations(gridCoordinates, projectiveMatrix);
        setGridCoordinates(transformedGridCoords);
    };

    const resetTransformations = () => {
        setRotationAngle(0);
        setScaleX(1);
        setScaleY(1);
        setPivotX(0);
        setPivotY(0);
        setAffineMatrix(defaultAffineMatrix);
        setProjectiveMatrix(defaultProjectiveMatrix);
    };

    const resetGridSettings = () => {
        setGridSize(defaultGridSettings.gridSize);
        setGridDensity(defaultGridSettings.gridDensity);
        setGridColor(defaultGridSettings.gridColor);
        setCanvasSize(defaultGridSettings.canvasSize);
        updateGridCoordinates();
        updateShapeCoordinates();
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
                updateShapeCoordinates={updateShapeCoordinates}
                defaultShapeElements={defaultShapeElements}
                rotationAngle={rotationAngle}
                setRotationAngle={setRotationAngle}
                scaleX={scaleX}
                setScaleX={setScaleX}
                scaleY={scaleY}
                setScaleY={setScaleY}
                pivotX={pivotX}
                setPivotX={setPivotX}
                pivotY={pivotY}
                setPivotY={setPivotY}
                onScale={() => scaleShape(shapeCoordinates, scaleX, scaleY, setShapeCoordinates)}
                onRotate={() => rotateShape(shapeCoordinates, rotationAngle, pivotX * (gridSize / defaultGridSize), pivotY * (gridSize / defaultGridSize), setShapeCoordinates)}
                gridSize={gridSize}
                setGridSize={setGridSize}
                gridDensity={gridDensity}
                setGridDensity={setGridDensity}
                gridColor={gridColor}
                setGridColor={setGridColor}
                canvasSize={canvasSize}
                setCanvasSize={setCanvasSize}
                translateX={translateX}
                setTranslateX={setTranslateX}
                translateY={translateY}
                setTranslateY={setTranslateY}
                onTranslate={applyTranslation}
                affineMatrix={affineMatrix}
                setAffineMatrix={setAffineMatrix}
                onApplyAffine={applyAffineTransformation}
                onApplyAffineToGrid={applyAffineToGrid}
                projectiveMatrix={projectiveMatrix}
                setProjectiveMatrix={setProjectiveMatrix}
                onApplyProjective={applyProjectiveTransformation}
                onApplyProjectiveToGrid={applyProjectiveToGrid}
                resetTransformations={resetTransformations}
                resetShapeCoordinates={resetShapeCoordinates}
                resetGridSettings={resetGridSettings}
                setShapeCoordinates={setShapeCoordinates}
                onApplySymmetry={applySymmetryTransformation}
            />
            <Shape coordinates={shapeCoordinates} canvasSize={canvasSize} />
            <Graph
                pivot={isTransformed ? null : { x: pivotX, y: pivotY }}
                gridSize={gridSize}
                defaultGridSize={defaultGridSize}
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




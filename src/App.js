import React, { useState } from 'react';
import Graph from './components/Graph/Graph';
import Shape from './components/Graph/Shape';
import SideMenu from './components/SideMenu/SideMenu';
import { multiplyMatrix, getRotationMatrix, getTranslationMatrix, getScalingMatrix } from './utils/matrixUtils';
import styles from './App.scss';

const App = () => {
    const defaultCanvasWidth = 1200;
    const defaultCanvasHeight = 600;
    const defaultGridSize = 20;

    const [canvasWidth, setCanvasWidth] = useState(defaultCanvasWidth);
    const [canvasHeight, setCanvasHeight] = useState(defaultCanvasHeight);
    const [gridSize, setGridSize] = useState(defaultGridSize);

    const [rotationAngle, setRotationAngle] = useState(0);
    const [scaleX, setScaleX] = useState(1);
    const [scaleY, setScaleY] = useState(1);
    const [pivotX, setPivotX] = useState(0);
    const [pivotY, setPivotY] = useState(0);
    const [cumulativeTranslateX, setCumulativeTranslateX] = useState(0);
    const [cumulativeTranslateY, setCumulativeTranslateY] = useState(0);

    const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;

    const defaultCoordinates = [
        { radius: 20, center: { x: -100, y: 100 }, startAngle: degreesToRadians(450), endAngle: degreesToRadians(360) },
        { radius: 20, center: { x: 0, y: 100 }, startAngle: degreesToRadians(180), endAngle: degreesToRadians(0) },
        { radius: 20, center: { x: 100, y: 100 }, startAngle: degreesToRadians(180), endAngle: degreesToRadians(90) },
        { radius: 20, center: { x: 100, y: -100 }, startAngle: degreesToRadians(270), endAngle: degreesToRadians(180) },
        { radius: 20, center: { x: 0, y: -100 }, startAngle: degreesToRadians(360), endAngle: degreesToRadians(180) },
        { radius: 20, center: { x: -100, y: -100 }, startAngle: degreesToRadians(360), endAngle: degreesToRadians(270) },
    ];

    const [shapeCoordinates, setShapeCoordinates] = useState(defaultCoordinates);

    const resetShape = () => {
        setShapeCoordinates(defaultCoordinates);
        setRotationAngle(0);
        setScaleX(1);
        setScaleY(1);
        setCumulativeTranslateX(0);
        setCumulativeTranslateY(0);
    };

    const resetGrid = () => {
        setCanvasWidth(defaultCanvasWidth);
        setCanvasHeight(defaultCanvasHeight);
        setGridSize(defaultGridSize);
    };

    const applyTransformation = (transformationMatrix) => {
        if (!transformationMatrix) {
            console.error("Invalid transformation matrix");
            return;
        }

        const transformedCoordinates = shapeCoordinates.map((coord) => {
            if (coord.center) {
                const adjustedCenter = {
                    x: coord.center.x - pivotX + cumulativeTranslateX,
                    y: coord.center.y - pivotY + cumulativeTranslateY
                };
                const transformedCenter = multiplyMatrix(transformationMatrix, adjustedCenter);

                return {
                    ...coord,
                    center: {
                        x: transformedCenter.x + pivotX - cumulativeTranslateX,
                        y: transformedCenter.y + pivotY - cumulativeTranslateY
                    }
                };
            } else if (coord.x !== undefined && coord.y !== undefined) {
                // Apply transformation to points
                const adjustedPoint = {
                    x: coord.x - pivotX + cumulativeTranslateX,
                    y: coord.y - pivotY + cumulativeTranslateY
                };
                const transformedPoint = multiplyMatrix(transformationMatrix, adjustedPoint);

                return {
                    ...coord,
                    x: transformedPoint.x + pivotX - cumulativeTranslateX,
                    y: transformedPoint.y + pivotY - cumulativeTranslateY
                };
            }
            return coord;
        });

        setShapeCoordinates(transformedCoordinates);
    };


    const handleRotation = (angleInDegrees) => {
        setRotationAngle(angleInDegrees);

        const updatedCoordinates = shapeCoordinates.map((coord) => {
            if (coord.startAngle !== undefined && coord.endAngle !== undefined) {
                return {
                    ...coord,
                    startAngle: coord.startAngle,
                    endAngle: coord.endAngle,
                };
            }
            return coord;
        });

        setShapeCoordinates(updatedCoordinates);
    };

    const handleTranslation = (dx, dy) => {
        const newTranslateX = cumulativeTranslateX + dx;
        const newTranslateY = cumulativeTranslateY + dy;

        setCumulativeTranslateX(newTranslateX);
        setCumulativeTranslateY(newTranslateY);

        const translationMatrix = getTranslationMatrix(newTranslateX, newTranslateY);
        applyTransformation(translationMatrix);
    };

    const handleScaling = (sx, sy) => {
        setScaleX(sx);
        setScaleY(sy);
        const scalingMatrix = getScalingMatrix(sx, sy);
        applyTransformation(scalingMatrix);
    };

    return (
        <div className={styles.app}>
            <div className={styles.canvasWrapper}>
                <Graph
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                    gridSize={gridSize}
                    centerPoint={{ x: pivotX, y: pivotY }}
                />
                <Shape
                    shapeCoordinates={shapeCoordinates}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                    rotationAngle={rotationAngle}
                    scaleX={scaleX}
                    scaleY={scaleY}
                    pivotX={pivotX}
                    pivotY={pivotY}
                />
            </div>
            <SideMenu
                shapeCoordinates={shapeCoordinates}
                setShapeCoordinates={setShapeCoordinates}
                onResetShape={resetShape}
                onResetGrid={resetGrid}
                onRotate={handleRotation}
                onTranslate={handleTranslation}
                onScale={handleScaling}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                gridSize={gridSize}
                setCanvasWidth={setCanvasWidth}
                setCanvasHeight={setCanvasHeight}
                setGridSize={setGridSize}
                pivotX={pivotX}
                pivotY={pivotY}
                setPivotX={setPivotX}
                setPivotY={setPivotY}
            />
        </div>
    );
};

export default App;

import React, { useState } from 'react';
import Shape from './components/Shape/Shape';
import Graph from './components/Graph/Graph';
import SideMenu from './components/SideMenu/SideMenu';
import { calculateArc, applyTransformation, scaleShape, rotateShape } from './utils/utils';

const App = () => {
    const [shapeElements, setShapeElements] = useState([
        { type: 'point', x: 100, y: 100 },
        { type: 'point', x: 200, y: 100 },
        { type: 'point', x: 200, y: 200 },
        { type: 'arc', centerX: 150, centerY: 150, radius: 50, startAngle: 0, endAngle: -90 },
        { type: 'point', x: 200, y: 200 },
        { type: 'arc', centerX: 100, centerY: 150, radius: 50, startAngle: -90, endAngle: -270 },
        { type: 'point', x: 200, y: 200 },

    ]);

    const [rotationAngle, setRotationAngle] = useState(0);
    const [scaleX, setScaleX] = useState(1);
    const [scaleY, setScaleY] = useState(1);
    const [pivotX, setPivotX] = useState(0);
    const [pivotY, setPivotY] = useState(0);
    const [gridSize, setGridSize] = useState(20);
    const [gridDensity, setGridDensity] = useState(1);
    const [gridColor, setGridColor] = useState('#cccccc');
    const [canvasSize, setCanvasSize] = useState(800);

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
            />
            <Shape
                coordinates={shapeCoordinates}
                canvasSize={canvasSize}
            />
            <Graph
                pivot={{ x: pivotX, y: pivotY }}
                gridSize={gridSize}
                gridDensity={gridDensity}
                gridColor={gridColor}
                canvasSize={canvasSize}
            />
        </div>
    );
};

export default App;
import React, { useState } from 'react';
import styles from './SideMenu.module.scss';

const SideMenu = ({
                      shapeCoordinates,
                      setShapeCoordinates,
                      onResetShape,
                      onResetGrid,
                      onRotate,
                      onTranslate,
                      onScale,
                      canvasWidth,
                      canvasHeight,
                      gridSize,
                      setCanvasWidth,
                      setCanvasHeight,
                      setGridSize,
                      pivotX,
                      pivotY,
                      setPivotX,
                      setPivotY,
                  }) => {
    const [rotationAngle, setRotationAngle] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [scaleX, setScaleX] = useState(1);
    const [scaleY, setScaleY] = useState(1);

    const radiansToDegrees = (radians) => (radians * 180) / Math.PI;
    const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;

    const handleRotationChange = (e) => {
        const newAngle = Number(e.target.value);
        setRotationAngle(newAngle);
        onRotate(newAngle);
    };


    const handleTranslationChange = (e) => {
        const { name, value } = e.target;
        const numericValue = Number(value);

        if (name === 'translateX') {
            setTranslateX(numericValue);
            onTranslate(numericValue, translateY);
        } else if (name === 'translateY') {
            setTranslateY(numericValue);
            onTranslate(translateX, numericValue);
        }
    };

    const handleScalingChange = (e) => {
        const { name, value } = e.target;
        const numericValue = Number(value);
        if (name === 'scaleX') {
            setScaleX(numericValue);
            onScale(numericValue, scaleY);
        }
        if (name === 'scaleY') {
            setScaleY(numericValue);
            onScale(scaleX, numericValue);
        }
    };

    const handleCoordinateChange = (index, e) => {
        const { name, value } = e.target;
        const updatedCoordinates = [...shapeCoordinates];
        const numericValue = Number(value);

        if (name.includes('center')) {
            const centerKey = name.split('.')[1];
            updatedCoordinates[index] = {
                ...updatedCoordinates[index],
                center: { ...updatedCoordinates[index].center, [centerKey]: numericValue }
            };
        } else if (name === 'startAngle' || name === 'endAngle') {
            updatedCoordinates[index] = { ...updatedCoordinates[index], [name]: degreesToRadians(numericValue) };
        } else {
            updatedCoordinates[index] = { ...updatedCoordinates[index], [name]: numericValue };
        }

        setShapeCoordinates(updatedCoordinates);
    };

    const handleCanvasWidthChange = (e) => {
        setCanvasWidth(Number(e.target.value));
    };

    const handleCanvasHeightChange = (e) => {
        setCanvasHeight(Number(e.target.value));
    };

    const handleGridSizeChange = (e) => {
        setGridSize(Number(e.target.value));
    };

    return (
        <div className={styles.sideMenu}>
            <div className={styles.sideMenuWrapper}>
                <div className={styles.gridWrapper}>
                    <h2>Grid Settings</h2>
                    <div className={styles.controlItem}>
                        <label>Width:</label>
                        <input
                            type="number"
                            value={canvasWidth.toFixed(0)}
                            onChange={handleCanvasWidthChange}
                        />
                    </div>
                    <div className={styles.controlItem}>
                        <label>Height:</label>
                        <input
                            type="number"
                            value={canvasHeight.toFixed(0)}
                            onChange={handleCanvasHeightChange}
                        />
                    </div>
                    <div className={styles.controlItem}>
                        <label>Grid Size:</label>
                        <input
                            type="number"
                            value={gridSize.toFixed(0)}
                            onChange={handleGridSizeChange}
                        />
                    </div>
                    <button className={styles.resetButton} onClick={onResetGrid}>
                        Reset Grid Settings
                    </button>
                </div>
                <div className={styles.shapeWrapper}>
                    <h2>Shape Settings</h2>
                    {shapeCoordinates.map((coord, index) => (
                        <div key={index} className={styles.controlItem}>
                            {coord.center ? (
                                <>
                                    <label>Center X{index + 1}:</label>
                                    <input
                                        type="number"
                                        name="center.x"
                                        value={coord.center.x.toFixed(0)} // Обмежуємо десяткові знаки до 0
                                        onChange={(e) => handleCoordinateChange(index, e)}
                                        step="1"
                                    />
                                    <label>Center Y{index + 1}:</label>
                                    <input
                                        type="number"
                                        name="center.y"
                                        value={coord.center.y.toFixed(0)} // Обмежуємо десяткові знаки до 0
                                        onChange={(e) => handleCoordinateChange(index, e)}
                                        step="1"
                                    />
                                    <label>Radius:</label>
                                    <input
                                        type="number"
                                        name="radius"
                                        value={coord.radius.toFixed(0)} // Обмежуємо десяткові знаки до 0
                                        onChange={(e) => handleCoordinateChange(index, e)}
                                        step="1"
                                    />
                                    <label>Start Ang:</label>
                                    <input
                                        type="number"
                                        name="startAngle"
                                        value={radiansToDegrees(coord.startAngle).toFixed(0)} // Обмежуємо десяткові знаки до 0
                                        onChange={(e) => handleCoordinateChange(index, e)}
                                        step="10"
                                    />
                                    <label>End Ang:</label>
                                    <input
                                        type="number"
                                        name="endAngle"
                                        value={radiansToDegrees(coord.endAngle).toFixed(0)} // Обмежуємо десяткові знаки до 0
                                        onChange={(e) => handleCoordinateChange(index, e)}
                                        step="10"
                                    />
                                </>
                            ) : (
                                <>
                                    <label>Point X{index + 1}:</label>
                                    <input
                                        type="number"
                                        name="x"
                                        value={coord.x.toFixed(0)} // Обмежуємо десяткові знаки до 0
                                        onChange={(e) => handleCoordinateChange(index, e)}
                                        step="1"
                                    />
                                    <label>Point Y{index + 1}:</label>
                                    <input
                                        type="number"
                                        name="y"
                                        value={coord.y.toFixed(0)} // Обмежуємо десяткові знаки до 0
                                        onChange={(e) => handleCoordinateChange(index, e)}
                                        step="1"
                                    />
                                </>
                            )}
                        </div>
                    ))}
                    <button className={styles.resetButton} onClick={onResetShape}>
                        Reset Shape Settings
                    </button>
                </div>
                <div className={styles.euclideanWrapper}>

                    <h2>Euclidean Transformations</h2>
                    <div className={styles.controlItem}>
                        <label>Rotate:</label>
                        <input
                            type="number"
                            value={rotationAngle.toFixed(0)}
                            onChange={handleRotationChange}
                        />
                    </div>

                    <div className={styles.controlItem}>
                        <label>Move X:</label>
                        <input
                            type="number"
                            name="translateX"
                            value={translateX.toFixed(0)}
                            onChange={handleTranslationChange}
                        />
                        <label>Move Y:</label>
                        <input
                            type="number"
                            name="translateY"
                            value={translateY.toFixed(0)}
                            onChange={handleTranslationChange}
                        />
                    </div>

                    <div className={styles.controlItem}>
                        <label>Scale X:</label>
                        <input
                            type="number"
                            name="scaleX"
                            value={scaleX.toFixed(1)}
                            onChange={handleScalingChange}
                            step = "0.1"
                        />
                        <label>Scale Y:</label>
                        <input
                            type="number"
                            name="scaleY"
                            value={scaleY.toFixed(1)}
                            onChange={handleScalingChange}
                            step = "0.1"
                        />
                    </div>
                    <div className={styles.controlItem}>
                        <label>Pivot X:</label>
                        <input
                            type="number"
                            value={pivotX}
                            onChange={(e) => setPivotX(Number(e.target.value))}
                        />
                        <label>Pivot Y:</label>
                        <input
                            type="number"
                            value={pivotY}
                            onChange={(e) => setPivotY(Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideMenu;
import React from 'react';
import styles from './SideMenu.module.scss';

const SideMenu = ({
                      shapeCoordinates = [],
                      setShapeCoordinates,
                      onResetShape,
                      onResetGrid,
                      canvasWidth,
                      canvasHeight,
                      gridSize,
                      setCanvasWidth,
                      setCanvasHeight,
                      setGridSize
                  }) => {
    const radiansToDegrees = (radians) => (radians * 180) / Math.PI;

    const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;

    const handleCoordinateChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const updatedCoordinates = [...shapeCoordinates];
        const numericValue = Number(value);

        if (name === 'radius' && numericValue < 0) {
            return;
        }


        if (type === 'checkbox' && name === 'counterclockwise') {
            updatedCoordinates[index] = { ...updatedCoordinates[index], [name]: checked };
        } else {
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
                            value={canvasWidth}
                            onChange={handleCanvasWidthChange}
                        />
                    </div>
                    <div className={styles.controlItem}>
                        <label>Height:</label>
                        <input
                            type="number"
                            value={canvasHeight}
                            onChange={handleCanvasHeightChange}
                        />
                    </div>
                    <div className={styles.controlItem}>
                        <label>Grid Size:</label>
                        <input
                            type="number"
                            value={gridSize}
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
                                        value={coord.center.x}
                                        onChange={(e) => handleCoordinateChange(index, e)}
                                        step="10"
                                    />
                                    <label>Center Y{index + 1}:</label>
                                    <input
                                        type="number"
                                        name="center.y"
                                        value={coord.center.y}
                                        onChange={(e) => handleCoordinateChange(index, e)}
                                        step="10"
                                    />
                                    <label>Radius:</label>
                                    <input
                                        type="number"
                                        name="radius"
                                        value={coord.radius}
                                        onChange={(e) => handleCoordinateChange(index, e)}
                                        step="1"
                                    />
                                    <label>Start Angle (degrees):</label>
                                    <input
                                        type="number"
                                        name="startAngle"
                                        value={radiansToDegrees(coord.startAngle)}
                                        onChange={(e) => handleCoordinateChange(index, e)}
                                        step="10"
                                    />
                                    <label>End Angle (degrees):</label>
                                    <input
                                        type="number"
                                        name="endAngle"
                                        value={radiansToDegrees(coord.endAngle)}
                                        onChange={(e) => handleCoordinateChange(index, e)}
                                        step="10"
                                    />
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="counterclockwise"
                                            checked={coord.counterclockwise}
                                            onChange={(e) => handleCoordinateChange(index, e)}
                                            className={styles.checkbox}
                                        />
                                    </label>
                                </>
                            ) : (
                                <>
                                    <label>Point X{index + 1}:</label>
                                    <input
                                        type="number"
                                        name="x"
                                        value={coord.x}
                                        onChange={(e) => handleCoordinateChange(index, e)}
                                        step="10"
                                    />
                                    <label>Point Y{index + 1}:</label>
                                    <input
                                        type="number"
                                        name="y"
                                        value={coord.y}
                                        onChange={(e) => handleCoordinateChange(index, e)}
                                        step="10"
                                    />
                                </>
                            )}
                        </div>

                    ))}
                    <button className={styles.resetButton} onClick={onResetShape}>
                        Reset Shape Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SideMenu;
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
    const handleCoordinateChange = (index, e) => {
        const { name, value } = e.target;
        const updatedCoordinates = [...shapeCoordinates];
        updatedCoordinates[index] = { ...updatedCoordinates[index], [name]: Number(value) };
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
                        <label>Canvas Width:</label>
                        <input
                            type="number"
                            value={canvasWidth}
                            onChange={handleCanvasWidthChange}
                        />
                    </div>
                    <div className={styles.controlItem}>
                        <label>Canvas Height:</label>
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
                            <label>X{index + 1}:</label>
                            <input
                                type="number"
                                name="x"
                                value={coord.x}
                                onChange={(e) => handleCoordinateChange(index, e)}
                            />
                            <label>Y{index + 1}:</label>
                            <input
                                type="number"
                                name="y"
                                value={coord.y}
                                onChange={(e) => handleCoordinateChange(index, e)}
                            />
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

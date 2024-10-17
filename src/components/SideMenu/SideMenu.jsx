import React, { useState } from 'react';
import { CloseSquare, Setting } from 'iconic-react';
import { motion, AnimatePresence } from 'framer-motion'; // Import necessary components
import styles from './SideMenu.module.scss';

const SideMenu = ({
                      shapeElements,
                      setShapeElements,
                      rotationAngle,
                      setRotationAngle,
                      scaleX,
                      scaleY,
                      setScaleX,
                      setScaleY,
                      pivotX,
                      pivotY,
                      setPivotX,
                      setPivotY,
                      onScale,
                      onRotate,
                      updateShapeCoordinates,
                      gridSize,
                      setGridSize,
                      gridDensity,
                      setGridDensity,
                      gridColor,
                      setGridColor,
                      canvasSize,
                      setCanvasSize,
                  }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleRotationChange = (e) => {
        const newAngle = Number(e.target.value);
        setRotationAngle(newAngle);
        onRotate();
    };

    const handleScalingChange = (e) => {
        const { name, value } = e.target;
        const numericValue = Number(value);
        if (name === 'scaleX') {
            setScaleX(numericValue);
        } else if (name === 'scaleY') {
            setScaleY(numericValue);
        }
        onScale();
    };

    const handleElementChange = (index, field, value) => {
        const updatedElements = shapeElements.map((element, i) =>
            i === index ? { ...element, [field]: Number(value) } : element
        );
        setShapeElements(updatedElements);
        updateShapeCoordinates();
    };

    const menuVariants = {
        open: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 },
        },
        closed: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.3 },
        },
    };

    return (
        <div className={styles.sideMenu}>
            <div className={styles.sideMenuWrapper}>
                <div className={styles.buttonWrapper}>
                    <button
                        className={styles.toggleButton}
                        onClick={() => setIsOpen(prev => !prev)}
                    >
                        {isOpen ? <CloseSquare size="24" color="black"/> : <Setting size="24" color="black"/>}
                    </button>
                </div>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={menuVariants}
                        >
                            <h2>Settings</h2>
                            <div className={styles.euclideanWrapper}>
                                <h3>Euclidean Transformations</h3>
                                <div className={styles.controlItem}>
                                    <label>Rotate:</label>
                                    <input
                                        type="number"
                                        value={rotationAngle}
                                        onChange={handleRotationChange}
                                    />
                                </div>
                                <div className={styles.controlItem}>
                                    <label>Scale X:</label>
                                    <input
                                        type="number"
                                        name="scaleX"
                                        value={scaleX}
                                        onChange={handleScalingChange}
                                        step="0.1"
                                    />
                                    <label>Scale Y:</label>
                                    <input
                                        type="number"
                                        name="scaleY"
                                        value={scaleY}
                                        onChange={handleScalingChange}
                                        step="0.1"
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

                            <div className={styles.gridWrapper}>
                                <h3>Grid Settings</h3>
                                <div className={styles.controlItem}>
                                    <label>Grid Size:</label>
                                    <input
                                        type="number"
                                        value={gridSize}
                                        onChange={(e) => setGridSize(Number(e.target.value))}
                                    />
                                </div>
                                <div className={styles.controlItem}>
                                    <label>Grid Density:</label>
                                    <input
                                        type="number"
                                        value={gridDensity}
                                        onChange={(e) => setGridDensity(Number(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                                <div className={styles.controlItem}>
                                    <label>Grid Color:</label>
                                    <input
                                        type="color"
                                        value={gridColor}
                                        onChange={(e) => setGridColor(e.target.value)}
                                    />
                                </div>
                                <div className={styles.controlItem}>
                                    <label>Canvas Size:</label>
                                    <input
                                        type="number"
                                        value={canvasSize}
                                        onChange={(e) => setCanvasSize(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className={styles.shapeWrapper}>
                                <h3>Shape Coordinates</h3>
                                {shapeElements.map((element, index) => (
                                    <div key={index} className={styles.controlItem}>
                                        {element.type === 'point' ? (
                                            <>
                                                <label>X{index + 1}:</label>
                                                <input
                                                    type="number"
                                                    value={element.x}
                                                    onChange={(e) =>
                                                        handleElementChange(index, 'x', e.target.value)
                                                    }
                                                />
                                                <label>Y{index + 1}:</label>
                                                <input
                                                    type="number"
                                                    value={element.y}
                                                    onChange={(e) =>
                                                        handleElementChange(index, 'y', e.target.value)
                                                    }
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <label>X{index + 1}:</label>
                                                <input
                                                    type="number"
                                                    value={element.centerX}
                                                    onChange={(e) =>
                                                        handleElementChange(index, 'centerX', e.target.value)
                                                    }
                                                />
                                                <label>Y{index + 1}:</label>
                                                <input
                                                    type="number"
                                                    value={element.centerY}
                                                    onChange={(e) =>
                                                        handleElementChange(index, 'centerY', e.target.value)
                                                    }
                                                />
                                                <label>Radius:</label>
                                                <input
                                                    type="number"
                                                    value={element.radius}
                                                    onChange={(e) =>
                                                        handleElementChange(index, 'radius', e.target.value)
                                                    }
                                                />
                                                <label>Start Ang:</label>
                                                <input
                                                    type="number"
                                                    value={element.startAngle}
                                                    onChange={(e) =>
                                                        handleElementChange(index, 'startAngle', e.target.value)
                                                    }
                                                />
                                                <label>End Ang:</label>
                                                <input
                                                    type="number"
                                                    value={element.endAngle}
                                                    onChange={(e) =>
                                                        handleElementChange(index, 'endAngle', e.target.value)
                                                    }
                                                />
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SideMenu;
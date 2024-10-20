import React, { useState } from 'react';
import { CloseSquare, Setting, Refresh, Backward } from 'iconic-react';
import { motion, AnimatePresence } from 'framer-motion';
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
                      resetShapeCoordinates,
                      resetGridSettings,
                      translateX,
                      setTranslateX,
                      translateY,
                      setTranslateY,
                      onTranslate,
                      affineMatrix,
                      setAffineMatrix,
                      onApplyAffine,
                      onApplyAffineToGrid,
                      projectiveMatrix,
                      setProjectiveMatrix,
                      onApplyProjective,
                      onApplyProjectiveToGrid
                  }) => {
    const [isOpen, setIsOpen] = useState(false);

    const resetAll = () => {
        resetShapeCoordinates();
        resetGridSettings();
    }

    const handleRotationChange = (e) => {
        setRotationAngle(Number(e.target.value));
    };

    const handleScalingChange = (e) => {
        const { name, value } = e.target;
        if (name === 'scaleX') setScaleX(Number(value));
        if (name === 'scaleY') setScaleY(Number(value));
    };

    const handleElementChange = (index, field, value) => {
        const updatedElements = shapeElements.map((element, i) =>
            i === index ? { ...element, [field]: Number(value) } : element
        );
        setShapeElements(updatedElements);
        updateShapeCoordinates();
    };

    const handleMatrixChange = (rowIndex, colIndex, value) => {
        const newMatrix = affineMatrix.map((row, rIndex) =>
            rIndex === rowIndex
                ? row.map((col, cIndex) => (cIndex === colIndex ? parseFloat(value) : col))
                : row
        );
        setAffineMatrix(newMatrix);
    };

    const handleProjectiveMatrixChange = (rowIndex, colIndex, value) => {
        const newMatrix = projectiveMatrix.map((row, rIndex) =>
            rIndex === rowIndex
                ? row.map((col, cIndex) => (cIndex === colIndex ? parseFloat(value) : col))
                : row
        );
        setProjectiveMatrix(newMatrix);
    };

    const handleApplyAffine = () => {
        onApplyAffineToGrid();
        onApplyAffine();
    };

    const handleApplyProjective = () => {
        onApplyProjectiveToGrid();
        onApplyProjective();
    };

    const menuVariants = {
        open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        closed: { opacity: 0, y: -20, transition: { duration: 0.3 } },
    };

    const handleRotationButtonClick = () => {
        onRotate();
    };


    return (
        <div className={styles.sideMenu}>
            <div className={styles.sideMenuWrapper}>
                <div className={styles.buttonWrapper}>
                    <motion.button
                        className={styles.toggleButton}
                        onClick={() => setIsOpen((prev) => !prev)}
                        whileHover={{ scale: 0.9 }}
                        whileTap={{ scale: 0.8 }}
                    >
                        {isOpen ? <CloseSquare size="24" color="black" /> : <Setting size="24" color="black" />}
                    </motion.button>
                </div>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div initial="closed" animate="open" exit="closed" variants={menuVariants}>
                            <h2>Settings</h2>


                            <div className={styles.gridWrapper}>
                                <h3>Grid Settings</h3>
                                <div className={styles.controlItem}>
                                    <label>Grid Size:</label>
                                    <input type="number" value={gridSize}
                                           onChange={(e) => setGridSize(Number(e.target.value))}/>
                                </div>
                                <div className={styles.controlItem}>
                                    <label>Grid Density:</label>
                                    <input type="number" value={gridDensity}
                                           onChange={(e) => setGridDensity(Number(e.target.value))} step="0.1"/>
                                </div>
                                <div className={styles.controlItem}>
                                    <label>Grid Color:</label>
                                    <input type="color" value={gridColor}
                                           onChange={(e) => setGridColor(e.target.value)}/>
                                </div>
                                <div className={styles.controlItem}>
                                    <label>Canvas Size:</label>
                                    <input type="number" value={canvasSize}
                                           onChange={(e) => setCanvasSize(Number(e.target.value))}/>
                                </div>
                                <motion.button onClick={resetGridSettings} className={styles.resetButton}
                                               whileHover={{scaleY: 0.9, scaleX: 0.97}} whileTap={{scaleY: 0.8, y: 5}}>
                                    Reset Grid <Refresh size="24"/>
                                </motion.button>
                            </div>

                            <div className={styles.shapeWrapper}>
                                <h3>Shape Coordinates</h3>
                                {shapeElements.map((element, index) => {
                                    const isEmptyPoint = element.type === 'emptyPoint';
                                    let shapeIndex = 1;

                                    if (isEmptyPoint) {
                                        shapeIndex++;
                                        return <h4 key={index}>Shape {shapeIndex} Coordinates</h4>;
                                    }

                                    return (
                                        <div key={index} className={styles.controlItem}>
                                            {element.type === 'point' ? (
                                                <>
                                                    <label>X{index + 1}:</label>
                                                    <input
                                                        type="number"
                                                        value={element.x}
                                                        onChange={(e) => handleElementChange(index, 'x', e.target.value)}
                                                    />
                                                    <label>Y{index + 1}:</label>
                                                    <input
                                                        type="number"
                                                        value={element.y}
                                                        onChange={(e) => handleElementChange(index, 'y', e.target.value)}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <label>X{index + 1}:</label>
                                                    <input
                                                        type="number"
                                                        value={element.centerX}
                                                        onChange={(e) => handleElementChange(index, 'centerX', e.target.value)}
                                                    />
                                                    <label>Y{index + 1}:</label>
                                                    <input
                                                        type="number"
                                                        value={element.centerY}
                                                        onChange={(e) => handleElementChange(index, 'centerY', e.target.value)}
                                                    />
                                                    <label>Radius:</label>
                                                    <input
                                                        type="number"
                                                        value={element.radius}
                                                        onChange={(e) => handleElementChange(index, 'radius', e.target.value)}
                                                    />
                                                    <label>Start Angle:</label>
                                                    <input
                                                        type="number"
                                                        value={element.startAngle}
                                                        onChange={(e) => handleElementChange(index, 'startAngle', e.target.value)}
                                                    />
                                                    <label>End Angle:</label>
                                                    <input
                                                        type="number"
                                                        value={element.endAngle}
                                                        onChange={(e) => handleElementChange(index, 'endAngle', e.target.value)}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                                <motion.button onClick={resetShapeCoordinates} className={styles.resetButton}>
                                    Reset Shape <Refresh size="24"/>
                                </motion.button>
                                <motion.button onClick={resetAll} className={styles.resetAllButton}>
                                    Reset All <Refresh size="24"/>
                                </motion.button>
                            </div>


                            <div className={styles.euclideanWrapper}>
                                <h3>Euclidean Transformations</h3>
                                <div className={styles.controlItem}>
                                    <label>Rotate:</label>
                                    <input
                                        type="number"
                                        value={rotationAngle}
                                        onChange={handleRotationChange}
                                    />
                                    <motion.button onClick={handleRotationButtonClick} whileHover={{scale: 0.9}}
                                                   whileTap={{scale: 0.8}}>
                                        <Backward size="24" color="white"/>
                                    </motion.button>
                                </div>
                                <div className={styles.controlItem}>
                                    <label>Pivot X:</label>
                                    <input type="number" value={pivotX}
                                           onChange={(e) => setPivotX(Number(e.target.value))}/>
                                    <label>Pivot Y:</label>
                                    <input type="number" value={pivotY}
                                           onChange={(e) => setPivotY(Number(e.target.value))}/>
                                </div>
                                <div className={styles.controlItem}>
                                    <label>Scale X:</label>
                                    <input type="number" name="scaleX" value={scaleX} onChange={handleScalingChange}
                                           step="0.1"/>
                                    <label>Scale Y:</label>
                                    <input type="number" name="scaleY" value={scaleY} onChange={handleScalingChange}
                                           step="0.1"/>
                                    <motion.button onClick={onScale} whileHover={{scale: 0.9}} whileTap={{scale: 0.8}}>
                                        <Backward size="24" color="white"/>
                                    </motion.button>
                                </div>
                                <div className={styles.controlItem}>
                                    <label>Move X:</label>
                                    <input type="number" value={translateX}
                                           onChange={(e) => setTranslateX(Number(e.target.value))}/>
                                    <label>Move Y:</label>
                                    <input type="number" value={translateY}
                                           onChange={(e) => setTranslateY(Number(e.target.value))}/>
                                    <motion.button onClick={onTranslate} whileHover={{scaleY: 0.9, scaleX: 0.97}}
                                                   whileTap={{scaleY: 0.8, y: 5}}>
                                        <Backward size="24" color="white"/>
                                    </motion.button>
                                </div>
                            </div>

                            <div className={styles.affineWrapper}>
                                <h3>Affine Transformation</h3>
                                <div className={styles.matrixGrid}>
                                    {affineMatrix.map((row, rowIndex) => (
                                        row.map((value, colIndex) => (
                                            <input
                                                key={`${rowIndex}-${colIndex}`}
                                                type="number"
                                                value={value}
                                                step="0.1"
                                                className={styles.matrixInput}
                                                onChange={(e) => handleMatrixChange(rowIndex, colIndex, e.target.value)}
                                            />
                                        ))
                                    ))}
                                </div>
                                <motion.button onClick={handleApplyAffine} className={styles.resetButton}>
                                    Apply Affine
                                </motion.button>
                            </div>

                            <div className={styles.affineWrapper}>
                                <h3>Projective Transformation</h3>
                                <div className={styles.matrixGrid}>
                                    {projectiveMatrix.map((row, rowIndex) => (
                                        row.map((value, colIndex) => (
                                            <input
                                                key={`${rowIndex}-${colIndex}`}
                                                type="number"
                                                value={value}
                                                step="0.1"
                                                className={styles.matrixInput}
                                                onChange={(e) => handleProjectiveMatrixChange(rowIndex, colIndex, e.target.value)}
                                            />
                                        ))
                                    ))}
                                </div>
                                <motion.button onClick={handleApplyProjective} className={styles.resetButton}>
                                    Apply Projective
                                </motion.button>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SideMenu;

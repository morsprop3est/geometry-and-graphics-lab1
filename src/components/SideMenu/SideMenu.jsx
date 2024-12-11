import React, { useState } from 'react';
import { CloseSquare, Setting } from 'iconic-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SideMenu.module.scss';

const SideMenu = ({
                      gridSize,
                      setGridSize,
                      gridDensity,
                      setGridDensity,
                      gridColor,
                      setGridColor,
                      canvasSize,
                      setCanvasSize,
                      scaleX, setScaleX,
                      scaleY, setScaleY,
                      translateX, setTranslateX,
                      translateY, setTranslateY,
                      rotate, setRotate,
                      ifsCoefficients, setIfsCoefficients,
                      iterations, setIterations,
                  }) => {
    const [isOpen, setIsOpen] = useState(false);

    const menuVariants = {
        open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        closed: { opacity: 0, y: -20, transition: { duration: 0.3 } },
    };

    const handleCoefficientChange = (index, field, value) => {
        const updatedCoefficients = [...ifsCoefficients];
        updatedCoefficients[index] = {
            ...updatedCoefficients[index],
            [field]: parseFloat(value),
        };
        setIfsCoefficients(updatedCoefficients);
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

                            <div className={styles.gridWrapper}>
                                <h3>Transformation Settings</h3>
                                <div className={styles.controlItem}>
                                    <label>ScaleX:</label>
                                    <input
                                        type="number"
                                        value={scaleX}
                                        onChange={(e) => setScaleX(Number(e.target.value))}
                                        step="0.1"
                                    />
                                    <label>ScaleY:</label>
                                    <input
                                        type="number"
                                        value={scaleY}
                                        onChange={(e) => setScaleY(Number(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                                <div className={styles.controlItem}>
                                    <label>Translate X:</label>
                                    <input
                                        type="number"
                                        value={translateX}
                                        onChange={(e) => setTranslateX(Number(e.target.value))}
                                        step="10"
                                    />
                                    <label>Translate Y:</label>
                                    <input
                                        type="number"
                                        value={translateY}
                                        onChange={(e) => setTranslateY(Number(e.target.value))}
                                        step="10"
                                    />
                                </div>
                                <div className={styles.controlItem}>
                                    <label>Rotate:</label>
                                    <input
                                        type="number"
                                        value={rotate}
                                        onChange={(e) => setRotate(Number(e.target.value))}
                                        step="5"
                                    />
                                </div>
                            </div>

                            <div className={styles.gridWrapper}>
                                <h3>IFS Settings</h3>
                                <div className={styles.controlItem}>
                                    <label>Iterations:</label>
                                    <input
                                        type="number"
                                        value={iterations}
                                        onChange={(e) => setIterations(Number(e.target.value))}
                                    />
                                </div>
                                <div className={styles.gridWrapper}>
                                    {['a', 'b', 'c', 'd', 'e', 'f'].map((key) => (
                                        <div key={key} className={styles.controlItem}>
                                            <h4>{key.toUpperCase()}</h4>
                                            {ifsCoefficients.map((coeff, index) => (
                                                <div key={index} className={styles.controlItem}>
                                                    <input
                                                        type="number"
                                                        value={coeff[key]}
                                                        onChange={(e) =>
                                                            handleCoefficientChange(index, key, e.target.value)
                                                        }
                                                        step="0.01"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                    <div className={styles.controlItem}>
                                        <h4>P</h4>
                                        {ifsCoefficients.map((coeff, index) => (
                                            <div key={index} className={styles.controlItem}>
                                                <input
                                                    type="number"
                                                    value={coeff.p}
                                                    onChange={(e) => handleCoefficientChange(index, 'p', e.target.value)}
                                                    step="0.01"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SideMenu;

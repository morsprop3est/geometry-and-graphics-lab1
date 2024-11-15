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
                          showPoints,
                          setShowPoints,
                          showLines,
                          setShowLines,
                          toggleTransformation,
                          saveShapeData,
                      }) => {
        const [isOpen, setIsOpen] = useState(false);

        const menuVariants = {
            open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
            closed: { opacity: 0, y: -20, transition: { duration: 0.3 } },
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
                                    <h3>Visibility Settings</h3>
                                    <div className={styles.controlItem}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={showPoints}
                                                onChange={(e) => setShowPoints(e.target.checked)}
                                            />
                                            Show Points
                                        </label>
                                    </div>
                                    <div className={styles.controlItem}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={showLines}
                                                onChange={(e) => setShowLines(e.target.checked)}
                                            />
                                            Show Lines
                                        </label>
                                    </div>
                                </div>

                                <div className={styles.shapeWrapper}>
                                    <div className={styles.controlItem}>
                                        <button onClick={toggleTransformation} className={styles.resetButton}>
                                            Toggle Shape Transformation
                                        </button>
                                    </div>

                                    <div className={styles.controlItem}>
                                        <button onClick={saveShapeData} className={styles.resetButton}>
                                            Save Shape Data
                                        </button>
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
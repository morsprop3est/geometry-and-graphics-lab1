import React, { useEffect, useRef, useState } from 'react'; // Додано useState
import { motion, AnimatePresence } from 'framer-motion'; // Додано імпорт motion та AnimatePresence
import { CloseSquare, Setting, Backward } from 'iconic-react'; // Додано імпорт іконок
import styles from './SideMenu.module.scss';

// Додайте або замініть menuVariants на ваші варіанти анімації
const menuVariants = {
    open: { opacity: 1, height: 'auto' },
    closed: { opacity: 0, height: 0 },
};

const SideMenu = ({
                      rotationAngle,
                      setRotationAngle,
                      pivotX,
                      pivotY,
                      setPivotX,
                      setPivotY,
                      onRotate,
                      translateX,
                      setTranslateX,
                      translateY,
                      setTranslateY,
                      onTranslate,
                      curveSettings,
                      setCurveSettings,
                          toggleAnimation,
                      isAnimating, //
                  }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleRotationChange = (e) => {
        setRotationAngle(Number(e.target.value));
    };

    const handleRotationButtonClick = () => {
        onRotate();
    };

    const handleCurveSettingChange = (key, value) => {
        setCurveSettings(prev => ({ ...prev, [key]: Number(value) }));
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

                            <div className={styles.euclideanWrapper}>
                                <h3>Euclidean Transformations</h3>
                                <div className={styles.controlItem}>
                                    <label>Rotate:</label>
                                    <input
                                        type="number"
                                        value={rotationAngle}
                                        onChange={handleRotationChange}
                                    />
                                    <motion.button
                                        onClick={handleRotationButtonClick}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Backward size="24" color="white" />
                                    </motion.button>
                                </div>
                                <div className={styles.controlItem}>
                                    <label>Pivot X:</label>
                                    <input type="number" value={pivotX} onChange={(e) => setPivotX(Number(e.target.value))} />
                                    <label>Pivot Y:</label>
                                    <input type="number" value={pivotY} onChange={(e) => setPivotY(Number(e.target.value))} />
                                </div>

                                <div className={styles.controlItem}>
                                    <label>Move X:</label>
                                    <input type="number" value={translateX} onChange={(e) => setTranslateX(Number(e.target.value))} />
                                    <label>Move Y:</label>
                                    <input type="number" value={translateY} onChange={(e) => setTranslateY(Number(e.target.value))} />
                                    <motion.button
                                        onClick={onTranslate}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Backward size="24" color="white" />
                                    </motion.button>
                                </div>
                            </div>

                            <div className={styles.curveWrapper}>
                                <h3>Versiera Curve Parameters</h3>
                                <div className={styles.controlItem}>
                                    <label>Amplitude:</label>
                                    <input
                                        type="number"
                                        value={curveSettings.amplitude}
                                        onChange={(e) => handleCurveSettingChange('amplitude', e.target.value)}
                                    />
                                </div>
                                <div className={styles.controlItem}>
                                    <label>Scale:</label>
                                    <input
                                        type="number"
                                        value={curveSettings.scale}
                                        onChange={(e) => handleCurveSettingChange('scale', e.target.value)}
                                    />
                                </div>
                                <div className={styles.controlItem}>
                                    <label>Resolution:</label>
                                    <input
                                        type="number"
                                        value={curveSettings.resolution}
                                        onChange={(e) => handleCurveSettingChange('resolution', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={styles.controlItem}>
                                <motion.button
                                    onClick={toggleAnimation} // Додаємо обробник для кнопки анімації
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {isAnimating ? 'Stop Animation' : 'Start Animation'}
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

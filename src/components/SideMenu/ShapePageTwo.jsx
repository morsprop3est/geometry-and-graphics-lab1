import React from 'react';
import styles from './SideMenu.module.scss';
import {Refresh} from "iconic-react";
import {motion} from "framer-motion";

const ShapePageTwo = ({ shapeElements, handleElementChange, resetShapeCoordinates }) => {
    return (
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
                    <div className={styles.shapeWrapper} key={index}>
                        <div className={styles.controlItem}>
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
                    </div>
                );
            })}
            <motion.button
                onClick={resetShapeCoordinates}
                className={styles.resetButton}
                whileHover={{ scaleX: 0.95, scaleY: 0.9 }}
                whileTap={{ scale: 0.8 }}
            >
                Reset Shape<Refresh size="24"/>
            </motion.button>
        </div>
    );
};

export default ShapePageTwo;

import React, { useState, useEffect } from 'react';
import styles from './SideMenu.module.scss';
import {Backward, Refresh} from "iconic-react";
import {motion} from "framer-motion";

const ShapePageOne = ({
                          shapeElements,
                          defaultShapeElements,
                          setShapeElements,
                          updateShapeCoordinates,
                      }) => {
    const [distances, setDistances] = useState({
        AB: 0,
        BC: 0,
        CD: 0,
        DE: 0,
        EF: 0,
        FG: 0,
        GH: 0,
        HI: 0,
        IJ: 0,
        JK: 0,
        KL: 0,
        LA: 0,

        NO: 0,
        OP: 0,
        PQ: 0,
        QR: 0,
        RS: 0,
        ST: 0,
        TY: 0,
        YN: 0,
    });

    const newDistances = {
        AB: defaultShapeElements[0]?.radius || 0,
        BC: defaultShapeElements[0]?.centerX - defaultShapeElements[1]?.centerX - defaultShapeElements[0].radius - defaultShapeElements[1].radius || 0,
        CD: defaultShapeElements[1]?.radius || 0,
        DE: defaultShapeElements[1]?.centerY - defaultShapeElements[2]?.centerY - defaultShapeElements[1].radius - defaultShapeElements[2].radius || 0,
        EF: defaultShapeElements[2]?.radius || 0,
        FG: defaultShapeElements[3]?.centerX - defaultShapeElements[2]?.centerX - defaultShapeElements[2].radius - defaultShapeElements[3].radius || 0,
        GH: defaultShapeElements[3]?.radius || 0,
        HI: defaultShapeElements[4]?.centerX - defaultShapeElements[3]?.centerX - defaultShapeElements[3].radius - defaultShapeElements[4].radius || 0,
        IJ: defaultShapeElements[4]?.radius || 0,
        JK: defaultShapeElements[5]?.centerY - defaultShapeElements[4]?.centerY - defaultShapeElements[4].radius - defaultShapeElements[5].radius || 0,
        KL: defaultShapeElements[5]?.radius || 0,
        LA: defaultShapeElements[5]?.centerX - defaultShapeElements[0]?.centerX - defaultShapeElements[5].radius - defaultShapeElements[0].radius || 0,

        MN: defaultShapeElements[7]?.radius || 0,
        NO: defaultShapeElements[7]?.centerY - defaultShapeElements[8]?.centerY - defaultShapeElements[7].radius - defaultShapeElements[8].radius || 0,
        OP: defaultShapeElements[8]?.radius || 0,
        PQ: defaultShapeElements[8]?.centerY - defaultShapeElements[9]?.centerY - defaultShapeElements[8].radius - defaultShapeElements[9].radius || 0,
        QR: defaultShapeElements[9]?.radius || 0,
        RS: defaultShapeElements[10]?.centerY - defaultShapeElements[9]?.centerY - defaultShapeElements[9].radius - defaultShapeElements[10].radius || 0,
        ST: defaultShapeElements[10]?.radius || 0,
        TN: defaultShapeElements[7]?.centerY - defaultShapeElements[10]?.centerY - defaultShapeElements[7].radius - defaultShapeElements[10].radius || 0,
    };




    useEffect(() => {
        setDistances(newDistances);
    }, [shapeElements]);

    const resetShapeCoordinates = () => {
        setShapeElements(defaultShapeElements);
        updateShapeCoordinates();
    };

    const handleSegmentChange = (index, key, value) => {
        const updatedElements = [...shapeElements];

        updatedElements[index] = {
            ...updatedElements[index],
            [key]: value,
        };

        if (key === 'MN' || key === 'QR') {
            console.log('Зміна радіусів для елементів 7 і 9');
            console.log('Поточний радіус 7:', updatedElements[7]?.radius);
            console.log('Поточний радіус 9:', updatedElements[9]?.radius);
        }

        setShapeElements(updatedElements);
        updateShapeCoordinates();
    };


    const handleDistanceChange = (key, value) => {
        const distanceChange = value - distances[key];
        setDistances((prevDistances) => ({
            ...prevDistances,
            [key]: value,
        }));

        const updatedElements = [...shapeElements];

        if (key === 'BC' || key === 'FG') {
            updatedElements[1].centerX += distanceChange;
            updatedElements[2].centerX += distanceChange;
        } else if (key === 'HI' || key === 'LA') {
            updatedElements[4].centerX += distanceChange;
            updatedElements[5].centerX += distanceChange;
        } else if (key === 'JK' || key === 'DE') {
            updatedElements[0].centerY += distanceChange/2;
            updatedElements[1].centerY += distanceChange/2;
            updatedElements[5].centerY += distanceChange/2;
            updatedElements[2].centerY -= distanceChange/2;
            updatedElements[3].centerY -= distanceChange/2;
            updatedElements[4].centerY -= distanceChange/2;
        }
        if (key === 'RS' || key === 'PQ') {
            updatedElements[9].centerY -= distanceChange;
        } else if (key === 'NO' || key === 'TN') {
            updatedElements[7].centerY += distanceChange;
        }


        setShapeElements(updatedElements);
        updateShapeCoordinates();
    };

    return (
        <div className={styles.shapeWrapper}>
            <h4>Length:</h4>

            {['BC', 'DE', 'FG', 'HI', 'JK', 'LA', 'NO', 'PQ', 'RS', 'TN'].map((key) => (
                <div className={styles.controlItem} key={key}>
                    <label>{key}:</label>
                    <input
                        type="number"
                        value={distances[key]}
                        onChange={(e) => handleDistanceChange(key, Number(e.target.value))}
                        step='1'
                    />
                </div>
            ))}

            <div className={styles.shapeWrapper}>
                <h4>Radius:</h4>
                {['AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'OP', 'QR', 'ST'].map((key, index) => (
                    <div className={styles.controlItem} key={key}>
                        <label>{key} Radius:</label>
                        <input
                            type="number"
                            value={shapeElements[index]?.radius || 0}
                            onChange={(e) => handleSegmentChange(index, 'radius', Number(e.target.value))}
                        />
                    </div>
                ))}
            </div>
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

export default ShapePageOne;

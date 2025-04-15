import React, { createContext, useRef, useContext } from 'react';

const ObstacleContext = createContext();

export const useObstacle = () => useContext(ObstacleContext);

export const ObstacleProvider = ({ children }) => {
    const obstaclesRef = useRef([]);

    const registerObstacle = (box) => {
        if (box) {
            obstaclesRef.current.push(box);
        }
    };

    const clearObstacles = () => {
        obstaclesRef.current = [];
    };

    return (
        <ObstacleContext.Provider value={{ obstaclesRef, registerObstacle, clearObstacles }}>
            {children}
        </ObstacleContext.Provider>
    );
};

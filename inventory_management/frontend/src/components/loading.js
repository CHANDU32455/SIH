import React, { useEffect, useState } from 'react';

const LoadingAnimation = () => {
    const numberOfDots = 8; // Number of dots revolving
    const radius = 50; // Radius of the circle on which dots will rotate
    const animationSpeed = 0.05; // Speed of rotation

    const [angle, setAngle] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setAngle((prevAngle) => prevAngle + animationSpeed);
        }, 16); // Update every 16ms (~60fps)

        return () => clearInterval(interval);
    }, []);

    const dots = Array.from({ length: numberOfDots }).map((_, index) => {
        const currentAngle = angle + (index * (2 * Math.PI)) / numberOfDots;

        const x = radius * Math.cos(currentAngle);
        const y = radius * Math.sin(currentAngle);

        return (
            <div
                key={index}
                style={{
                    position: 'absolute',
                    width: '15px',
                    height: '15px',
                    backgroundColor: `hsl(${(index * 45) % 360}, 100%, 50%)`,
                    borderRadius: '50%',
                    transform: `translate(${x}px, ${y}px)`,
                    transition: 'transform 0.1s linear'
                }}
            />
        );
    });

    return (
        <div
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${radius * 2 + 50}px`,
                height: `${radius * 2 + 50}px`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            {dots}
        </div>
    );
};

export default LoadingAnimation;

/**
 * Custom React hook that returns the current window dimensions. Used throughout the entire site.
 *
 * Tracks window resize events and updates width and height accordingly.
 *
 * @returns {{ width: number, height: number }} An object containing the window's width and height in pixels.
 */

import { useState, useEffect } from "react";

const useWindowDimensions = () => {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return dimensions;
};

export default useWindowDimensions;

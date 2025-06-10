import React from "react";
import "./SkeletonLoader.css";

/**
 * SkeletonLoader component that displays a skeleton loading animation.
 * This is typically used to indicate that content is being loaded.
 * @returns {JSX.Element} Rendered SkeletonLoader component.
 */

const SkeletonLoader = () => {
    return (
        <div data-testid="canvas-skeleton" className="skeleton-loader">
            <div className="skeleton"></div>
        </div>
    );
};

export default SkeletonLoader;

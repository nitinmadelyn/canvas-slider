import React from 'react';
import CanvasSlider from '../CanvasSlider/CanvasSlider';
import ErrorBoundary from '../ErrorBoundry/ErrorBoundry';

const Container = () => {
  const imageSources = [
    '/images/0.jpg',
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
  ];

  return (
    <div className="canvas-slider-wrapper">
      <h1 className="canvas-slider-title">Canvas Image Slider</h1>
      <ErrorBoundary>
        <CanvasSlider imageUrls={imageSources} />
      </ErrorBoundary>
      <p className="canvas-slider-description">Drag to change image</p>
    </div>
  );
};

export default Container;

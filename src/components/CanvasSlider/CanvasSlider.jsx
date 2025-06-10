/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './CanvasSlider.css';
import { preloadImages } from '../../utils/preloadImages';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';
import throttle from 'lodash.throttle';
import { drawImagesToCanvas } from '../../utils/drawImageToCanvas';
import PropTypes from 'prop-types';

/**
 * CanvasSlider component allows users to drag through a series of images on a canvas.
 * It supports both mouse and touch events for interaction.
 * @param {Object} props - Component properties.
 * @param {Array} props.imageSources - Array of image URLs to be displayed in the slider.
 * @returns {JSX.Element} Rendered CanvasSlider component.
 */

const CanvasSlider = (props) => {
  const { imageUrls } = props;
  const isMobile = useMemo(() => window.innerWidth <= 480, []);
  const isTouchDevice = useMemo(
    () =>
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0),
    []
  );
  // canvas height & width for mobile devices
  const { CANVAS_WIDTH, CANVAS_HEIGHT, MAX_OFFSET } = useMemo(() => {
    const width = isMobile ? 320 : 640;
    const height = isMobile ? 200 : 400;
    return {
      CANVAS_WIDTH: width,
      CANVAS_HEIGHT: height,
      MAX_OFFSET: -width * (imageUrls.length - 1),
    };
  }, [isMobile, imageUrls.length]);

  const canvasRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const dragStartOffset = useRef(0);
  const lastDragEndOffset = useRef(0);
  const isValidDragStart = useRef(false);
  const imagesToBeLoaded = useRef(2);
  const nextImageScaleIndex = useRef(4);

  const [images, setImages] = useState([]);
  const [dragOffset, setDragOffset] = useState(0);
  const [error, setError] = useState(null);

  const getClientX = useCallback((e) => {
    return (
      e?.touches?.[0]?.clientX ??
      e?.changedTouches?.[0]?.clientX ??
      e?.clientX ??
      0
    );
  }, []);

  useEffect(() => {
    preloadImages(imageUrls.slice(0, imagesToBeLoaded.current))
      .then((allImages) => {
        setImages(allImages);
      })
      .catch((err) => {
        console.error('Failed to load images', err);
        setError(new Error('Failed to load images.'));
      });
  }, []);

  // triggers ErrorBoundary
  if (error) {
    throw error;
  }

  useEffect(() => {
    if (!canvasRef.current || images.length === 0) return;
    const cleanup = () => removeEventListener();
    addEventListener();
    return cleanup;
  }, [images]);

  // Drag slider logic
  useEffect(() => {
    if (!canvasRef.current || images.length === 0) return;
    const ctx = canvasRef.current.getContext('2d');

    canvasRef.current.width = CANVAS_WIDTH;
    canvasRef.current.height = CANVAS_HEIGHT;

    drawImagesToCanvas(ctx, images, dragOffset, CANVAS_WIDTH, CANVAS_HEIGHT);
  }, [images, dragOffset]);

  const handleStart = useCallback(
    (e) => {
      isDragging.current = true;
      isValidDragStart.current = true;
      startX.current = getClientX(e);
      dragStartOffset.current = dragOffset;
    },
    [dragOffset, getClientX]
  );

  const handleMove = useCallback(
    (e) => {
      if (!isDragging.current) return;
      const delta = getClientX(e) - startX.current;
      const newOffset =
        lastDragEndOffset.current + dragStartOffset.current + delta;

      // Clamp dragOffset to boundaries
      const clampedOffset = Math.max(MAX_OFFSET, Math.min(0, newOffset));
      setDragOffset(clampedOffset);

      // Proceed only if within valid range (dragged left)
      if (clampedOffset < 0) {
        const nextOffsetToLoadImage = MAX_OFFSET / nextImageScaleIndex.current;

        if (clampedOffset < nextOffsetToLoadImage) {
          if (imagesToBeLoaded.current >= imageUrls.length) return;

          const start = imagesToBeLoaded.current;
          const end = start + 1;

          imagesToBeLoaded.current++;
          nextImageScaleIndex.current--;

          preloadImages(imageUrls.slice(start, end))
            .then((allImages) => {
              setImages((prev) => [...prev, ...allImages]);
            })
            .catch((err) => {
              console.error('Failed to load images', err);
              setError(new Error('Failed to load images.'));
            });
        }
      }
    },
    [getClientX]
  );

  const throttledHandleMove = useCallback(throttle(handleMove, 16), []);

  const handleEnd = useCallback(
    (e) => {
      if (!isValidDragStart.current) return;
      isDragging.current = false;
      isValidDragStart.current = false;

      const delta = getClientX(e) - startX.current;
      const nextOffset = lastDragEndOffset.current + delta;

      // Clamp to boundaries
      const clampedOffset = Math.max(MAX_OFFSET, Math.min(0, nextOffset));
      lastDragEndOffset.current = clampedOffset;
    },
    [getClientX]
  );

  const manageEventListeners = useCallback(
    (action = 'add') => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const method =
        action === 'add' ? 'addEventListener' : 'removeEventListener';

      canvas[method]('mousedown', handleStart);
      window[method]('mousemove', throttledHandleMove);
      window[method]('mouseup', handleEnd);

      if (isTouchDevice) {
        canvas[method]('touchstart', handleStart, { passive: true });
        window[method]('touchmove', throttledHandleMove, { passive: true });
        window[method]('touchend', handleEnd);
      }
    },
    [handleStart, throttledHandleMove, handleEnd, isTouchDevice]
  );

  const addEventListener = useCallback(() => manageEventListeners('add'), []);
  const removeEventListener = useCallback(
    () => manageEventListeners('remove'),
    []
  );

  return images.length === 0 ? (
    <SkeletonLoader />
  ) : (
    <canvas
      role="img"
      aria-label="Image slider"
      ref={canvasRef}
      data-testid="canvas-slider"
      className="slider-canvas"
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
    />
  );
};

CanvasSlider.propTypes = {
  imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default CanvasSlider;

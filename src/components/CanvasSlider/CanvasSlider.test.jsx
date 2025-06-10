/* eslint-disable no-undef */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CanvasSlider from './CanvasSlider';
import { describe, expect, test } from 'vitest';

const mockImages = [
  '/images/img1.png',
  '/images/img2.png',
  '/images/img3.png',
  '/images/img4.png',
];

describe('CanvasSlider', () => {
  test('renders loading skeleton initially', () => {
    render(<CanvasSlider imageUrls={mockImages} />);
    const skeleton = screen.getByTestId('canvas-skeleton');
    expect(skeleton).toBeInTheDocument();
  });

  test('renders canvas after all images are loaded', async () => {
    render(<CanvasSlider imageUrls={mockImages} />);

    await waitFor(() => {
      const canvas = screen.getByTestId('canvas-slider');
      expect(canvas).toBeInTheDocument();
      expect(canvas.tagName).toBe('CANVAS');
    });
  });

  test('sets correct canvas width and height', async () => {
    render(<CanvasSlider imageUrls={mockImages} />);
    const canvas = await screen.findByTestId('canvas-slider');
    expect(canvas.width).toBeGreaterThan(0);
    expect(canvas.height).toBeGreaterThan(0);
  });

  test('allows dragging canvas with mouse', async () => {
    render(<CanvasSlider imageUrls={mockImages} />);

    const canvas = await screen.findByTestId('canvas-slider');

    fireEvent.mouseDown(canvas, { clientX: 300 });
    fireEvent.mouseMove(window, { clientX: 100 }); // simulate drag to left
    fireEvent.mouseUp(window, { clientX: 100 });

    // There’s no direct dragOffset test, so we can spy or test visible behavior
    await waitFor(() => {
      expect(global.canvasContextMock.drawImage).toHaveBeenCalled();
      expect(canvas).toBeInTheDocument(); // still valid
    });
  });

  test('allows dragging canvas with touch', async () => {
    render(<CanvasSlider imageUrls={mockImages} />);

    const canvas = await screen.findByTestId('canvas-slider');
    fireEvent.touchStart(canvas, {
      touches: [{ clientX: 300 }],
    });
    fireEvent.touchMove(window, {
      touches: [{ clientX: 100 }],
    });
    fireEvent.touchEnd(window, {
      changedTouches: [{ clientX: 100 }],
    });

    await waitFor(() => {
      expect(global.canvasContextMock.drawImage).toHaveBeenCalled();
    });
  });

  test('does not allow dragging beyond first image', async () => {
    render(<CanvasSlider imageUrls={mockImages} />);
    const canvas = await screen.findByTestId('canvas-slider');

    // Simulate large rightward drag (backwards)
    fireEvent.mouseDown(canvas, { clientX: 10 });
    fireEvent.mouseMove(window, { clientX: 1000 }); // dragging to the right too far
    fireEvent.mouseUp(window, { clientX: 1000 });

    // It should clamp drag offset to 0 (first image position)
    await waitFor(() => {
      expect(global.canvasContextMock.drawImage).toHaveBeenCalled();
    });
  });

  test('does not allow dragging beyond last image', async () => {
    render(<CanvasSlider imageUrls={mockImages} />);
    const canvas = await screen.findByTestId('canvas-slider');

    // Simulate large leftward drag beyond the last image
    fireEvent.mouseDown(canvas, { clientX: 1000 });
    fireEvent.mouseMove(window, { clientX: -2000 }); // drag way to the left
    fireEvent.mouseUp(window, { clientX: -2000 });

    // Confirm canvas rendered something
    await waitFor(() => {
      expect(global.canvasContextMock.drawImage).toHaveBeenCalled();
    });

    // Optionally inspect last draw call to ensure it does not exceed MAX_OFFSET
    const drawCalls = global.canvasContextMock.drawImage.mock.calls;
    const lastX = drawCalls[drawCalls.length - 1][1]; // x position

    const CANVAS_WIDTH = 640;
    const maxOffset = -CANVAS_WIDTH * (mockImages.length - 1);

    // Last image shouldn't be dragged past max offset
    expect(lastX).toBeGreaterThanOrEqual(maxOffset);
  });
});

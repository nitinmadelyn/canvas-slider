import 'vitest-canvas-mock';
import '@testing-library/jest-dom';
import { beforeAll, vi } from 'vitest';

// Mock Image loading globally
beforeAll(() => {
    globalThis.Image = class {
        constructor() {
            setTimeout(() => {
                if (this.onload) this.onload(); // simulate async load
            }, 0);
        }
        set src(_) {
            setTimeout(() => {
                if (this.onload) this.onload();
            }, 0);
        }
        get width() {
            return 100;
        }
        get height() {
            return 100;
        }
    };

    // Mock HTMLCanvasElement getContext method
    globalThis.canvasContextMock = {
        drawImage: vi.fn(),
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        fillStyle: '',
    };

    HTMLCanvasElement.prototype.getContext = () => globalThis.canvasContextMock;

});

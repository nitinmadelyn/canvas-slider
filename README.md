# 🖼️ Canvas Image Slider

A performant, lightweight image slider built using HTML `<canvas>` in React. Users can drag through multiple images seamlessly with support for mouse and touch input. Built with responsiveness, extensibility, and performance in mind.


## ✨ Features

- Renders first images on a single canvas for performance
- Supports mouse and touch drag interactions
- Responsive for both mobile and desktop devices
- Lazy image loading with a skeleton loader + only load images that are visible on the canvas (as & when needed)
- Enforces drag boundaries (cannot drag beyond first/last image)
- Scales large images, centers small ones with a neutral background
- Throws UI-friendly errors using Error Boundaries
- Unit tested with Vitest + React Testing Library
- Tested all above features on latest Chrome & Safari browser

## 📽️ Demo Video

<a href="https://www.loom.com/share/c28d276fa24e4c97ab4e21b99f39c220?sid=62216622-9387-474c-82b0-d63f86d92f08" target="_blank">
  <img src="https://cdn.loom.com/sessions/thumbnails/fcf138e1b2d54d59a0b0bd752b08033d-032edb0a06cdf221.jpg" 
       alt="Watch the demo" 
       width="640" 
       height="360" />
</a>


## ⚙️ Configuration

No additional environment configuration is required.

This project uses:
- **React v19.1.0** (with Vite)
- **Vitest** & **React Testing Library** for testing
- **Canvas API** for rendering
- No external UI libraries


## 🚀 Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/nitinmadelyn/canvas-slider.git
   cd canvas-slider
   npm install
   ```

2. **Serve the app from `/dist` folder:**
   ```bash
   npm run preview
   ```

3. **How to setup:**
    
    Install dependencies:
   ```bash
   npm install
   ```

   Run the app locally:
   ```bash
   npm run dev
   ```

   Build for production:
   ```bash
   npm run build
   ```

   Run Tests:
   ```bash
   npm run test
   ```
   ##### This will run all unit tests using Vitest with canvas properly mocked for DOM.


## 🧩 Component API: `<CanvasSlider />`

### Props:

| Prop        | Type       | Required | Description                                              |
| ----------- | ---------- | -------- | -------------------------------------------------------- |
| `imageUrls` | `string[]` | ✅        | Array of image URLs to preload and render in the canvas. |

### Example usage:
```bash
<CanvasSlider imageUrls={['/img1.jpg', '/img2.jpg', '/img3.jpg']} />
```

## 🔮 Possible Feature Extensions

Here are some great features that can be added in future versions:
* 🔁 Infinite loop of image slider
* 🏎️ Inertial scrolling(momentum-based dragging)
* ⬅️➡️ Navigation Arrows: Add buttons to move to the previous/next image.
* 🔘 Dot Indicators: Display current slide with clickable dot navigation.
* 🖼️ Thumbnail Navigation: Show image thumbnails below the canvas for quick jumps.
* 🔁 Auto-Slide:
  * Automatically switch images after a set interval
  * Option to pause/play or stop on hover
* 🧑‍🦯 Accessibility:
  * Keyboard arrow keys to navigate slider
  * Keyboard space key to pause & play the slider

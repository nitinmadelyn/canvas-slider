export const drawImagesToCanvas = (ctx, images, dragOffset, CANVAS_WIDTH, CANVAS_HEIGHT) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let xOffset = dragOffset;
    for (const img of images) {
        const isSmaller = img.width < CANVAS_WIDTH || img.height < CANVAS_HEIGHT;

        // Draw background if image is smaller
        if (isSmaller) {
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(xOffset, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        //Scale if image is larger than canvas
        const needsScale = img.width > CANVAS_WIDTH || img.height > CANVAS_HEIGHT;
        const scale = needsScale ? Math.min(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height) : 1;

        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;

        const x = xOffset + (CANVAS_WIDTH - drawWidth) / 2;
        const y = (CANVAS_HEIGHT - drawHeight) / 2;

        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        xOffset += CANVAS_WIDTH;
    }
};
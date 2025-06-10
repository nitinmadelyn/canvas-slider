export const preloadImages = (srcList) => {
    return Promise.all(
        srcList.map((src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = src;
                img.onload = () => resolve(img);
                img.onerror = reject;
            });
        })
    );
};

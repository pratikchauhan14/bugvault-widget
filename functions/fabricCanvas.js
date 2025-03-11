import { fabric } from "fabric";

export function createFabricCanvas(screenshotCanvas) {

    const scaleFactor = window.devicePixelRatio || 1;  // Get the device pixel ratio (default to 1 if not available)
    const width = screenshotCanvas.width / scaleFactor;  // Adjust the width for high DPI screens
    const height = screenshotCanvas.height / scaleFactor; // Adjust the height for high DPI screens



    const canvasContainer = document.querySelector(".bug-finder-canvas-container");
    if (!canvasContainer) return null;

    console.log(screenshotCanvas);
    

    // Remove old canvas if exists
    canvasContainer.innerHTML = `<canvas id="fabricCanvas"></canvas>`;

    const fabricCanvas = new fabric.Canvas("fabricCanvas", {
        width: screenshotCanvas.width,
        height: screenshotCanvas.height,
        backgroundColor: "#ffffff"
    });

    // Add screenshot image to canvas
    fabric.Image.fromURL(screenshotCanvas.toDataURL("image/png"), (img) => {
        img.set({ left: 0, top: 0, selectable: false });
        fabricCanvas.add(img);
        fabricCanvas.renderAll();
    });

    return fabricCanvas; // ✅ Return fabric instance
}
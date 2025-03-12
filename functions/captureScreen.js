import html2canvas from "html2canvas";
import { createFabricCanvas } from "./fabricCanvas.js";
import { addControlButton, createBugFinderUI } from "./uiUtils.js";
import { disableArrowMode, enableArrowDrawing } from "./arrowTool.js";
import { disableTextMode, enableTextTool } from "./textTool.js";
import util from "../util.js";

let selectionBox = null;
let startX = 0, startY = 0;
let isSelecting = false;
let rafId = null; // Used for requestAnimationFrame

export function startSelection() {
    if (isSelecting) return; // Prevent duplicate event listeners
    isSelecting = true;

    document.addEventListener("mousedown", startSelectionBox);
    document.addEventListener("mousemove", updateSelectionBox);
    document.addEventListener("mouseup", captureSelection);
}

function startSelectionBox(event) {
    document.body.style.userSelect = "none";
    startX = event.clientX;
    startY = event.clientY;

    selectionBox = document.createElement("div");
    selectionBox.id = "selection-box";
    Object.assign(selectionBox.style, {
        left: `${startX}px`,
        top: `${startY}px`,
        position: "fixed",
        border: "2px dashed red",
        background: "rgba(255, 0, 0, 0.1)",
        pointerEvents: "none",
        zIndex: "1000"
    });

    document.body.appendChild(selectionBox);
}

function updateSelectionBox(event) {
    if (!isSelecting || !selectionBox) return;

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
        const width = event.clientX - startX;
        const height = event.clientY - startY;
        
        Object.assign(selectionBox.style, {
            width: `${Math.abs(width)}px`,
            height: `${Math.abs(height)}px`,
            left: `${Math.min(startX, event.clientX)}px`,
            top: `${Math.min(startY, event.clientY)}px`
        });
    });
}

function captureSelection() {
    isSelecting = false;
    document.body.style.userSelect = "auto";
    
    if (!selectionBox) return;
    const { left, top, width, height } = selectionBox.getBoundingClientRect();
    document.body.removeChild(selectionBox);
    selectionBox = null;

    const dpr = window.devicePixelRatio || 1;

    console.log("📸 Capture Selection Info:", { dpr, left, top, width, height });

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    html2canvas(document.body, {
        scale: dpr,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight
    }).then(fullCanvas => {
        const scaleFix = fullCanvas.width / document.documentElement.scrollWidth;

        ctx.drawImage(
            fullCanvas,
            left * scaleFix, top * scaleFix, width * scaleFix, height * scaleFix,
            0, 0, width, height
        );

        console.log("✅ Final Capture Applied");

        createBugFinderUI("create");
        const fabricCanvas = createFabricCanvas(canvas);
        addControls(fabricCanvas);
    });

    stopSelection();
}

function addControls(fabricCanvas) {
    Object.entries(util.control).forEach(([key, button]) => {
        const el = document.createElement("button");
        el.id = button.id;
        el.textContent = button.text;

        el.addEventListener("click", () => {
            if (key === "arrow") {
                el.textContent = button.toggleText;
                disableTextMode(fabricCanvas);
                enableArrowDrawing(fabricCanvas);
            } else if (key === "addText") {
                el.textContent = button.toggleText;
                disableArrowMode(fabricCanvas);
                enableTextTool(fabricCanvas);
            } else if (key === "closePopup") {
                createBugFinderUI("remove");
                util.widgetButton();
            }
        });

        document.querySelector(".bug-finder-controls").appendChild(el);
    });
}

export function stopSelection() {
    document.removeEventListener("mousedown", startSelectionBox);
    document.removeEventListener("mousemove", updateSelectionBox);
    document.removeEventListener("mouseup", captureSelection);
    isSelecting = false;
}
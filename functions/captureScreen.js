import html2canvas from "html2canvas";
import { createFabricCanvas } from "./fabricCanvas.js";
import { addControlButton, createBugFinderUI } from "./uiUtils.js";
import { disableArrowMode, enableArrowDrawing } from "./arrowTool.js"; // ✅ Import the function
import { disableTextMode, enableTextTool } from "./textTool.js"; // ✅ Import the text tool function


let selectionBox = null;
let startX = 0, startY = 0;
let isSelecting = false;

export function startSelection() {
    document.addEventListener("mousedown", startSelectionBox);
    document.addEventListener("mousemove", updateSelectionBox);
    document.addEventListener("mouseup", captureSelection);
}

function startSelectionBox(event) {
    document.body.style.userSelect = "none";
    isSelecting = true;
    startX = event.clientX;
    startY = event.clientY;

    selectionBox = document.createElement("div");
    selectionBox.id = "selection-box";
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.position = "fixed";
    selectionBox.style.border = "2px dashed red";
    selectionBox.style.background = "rgba(255, 0, 0, 0.1)";
    selectionBox.style.pointerEvents = "none";
    selectionBox.style.zIndex = "1000";

    document.body.appendChild(selectionBox);
}

function updateSelectionBox(event) {
    if (!isSelecting || !selectionBox) return;

    let width = event.clientX - startX;
    let height = event.clientY - startY;

    selectionBox.style.width = `${Math.abs(width)}px`;
    selectionBox.style.height = `${Math.abs(height)}px`;
    selectionBox.style.left = `${Math.min(startX, event.clientX)}px`;
    selectionBox.style.top = `${Math.min(startY, event.clientY)}px`;
}

function captureSelection() {
    isSelecting = false;
    document.body.style.userSelect = "auto";

    

    if (!selectionBox) return;
    const { left, top, width, height } = selectionBox.getBoundingClientRect();

   
    
    
    document.body.removeChild(selectionBox);
    selectionBox = null;

    

    html2canvas(document.body, {
        x: left,
        y: top,
        width: width,
        height: height,
        scrollX: 0,
        scrollY: 0
    }).then(canvas => {

        createBugFinderUI("create");
        document.querySelector(".bug-finder-container").style.display = "block";

        const fabricCanvas = createFabricCanvas(canvas);

        console.log(width, height,canvas);
        

    // ✅ First, ensure buttons are added to the DOM
    addControlButton("toggleArrow", "Enable Arrow", () => {});
    addControlButton("addText", "Add Text", () => {});
    addControlButton("closePopup", "Close", () => {});

    // ✅ Wait for the UI to update, then attach event listeners
        let arrowButton = document.getElementById("toggleArrow");
        let textButton = document.getElementById("addText");
        let closePopup = document.getElementById("closePopup");

        if (closePopup) {
            closePopup.addEventListener("click", () => {
                createBugFinderUI("remove");
                //find startSelection button and add click event listeners startSelection
                document.getElementById("startSelection").addEventListener("click", startSelection);
            });
        }

        if (arrowButton) {
            arrowButton.addEventListener("click", () => {
                console.log("Enable Arrow Clicked!");

                // ✅ Disable text tool before enabling arrow mode
                disableTextMode(fabricCanvas);

                enableArrowDrawing(fabricCanvas);
            });
        } else {
            console.error("Arrow button not found!");
        }

        if (textButton) {
            textButton.addEventListener("click", () => {
                console.log("Add Text Clicked!");
                // ✅ Disable arrow mode before enabling text tool
                disableArrowMode(fabricCanvas);

                enableTextTool(fabricCanvas);
            });
        } else {
            console.error("Text button not found!");
        }
        
    });

    stopSelection();
}




export function stopSelection() {
    document.removeEventListener("mousedown", startSelectionBox);
    document.removeEventListener("mousemove", updateSelectionBox);
    document.removeEventListener("mouseup", stopSelection);
}
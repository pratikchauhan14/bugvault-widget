import html2canvas from "html2canvas";
import { createFabricCanvas } from "./fabricCanvas.js";
import { addControlButton, createBugFinderUI } from "./uiUtils.js";
import { disableArrowMode, enableArrowDrawing } from "./arrowTool.js"; // ✅ Import the function
import { disableTextMode, enableTextTool } from "./textTool.js"; // ✅ Import the text tool function
import util from "../util.js";


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

        const fabricCanvas = createFabricCanvas(canvas);

        

        
        Object.keys(util.control).forEach((key) => {
            const button = util.control[key];
            console.log(key,button);
            //addControlButton(button.id, button.text, () => {});

            let el = document.createElement("button");
            el.id = button.id;
            el.textContent = button.text;
            
            if(key == "arrow"){
                

                el.addEventListener("click", () => {
                    console.log("Enable Arrow Clicked!");
                    el.textContent = button.toggleText;

                    disableTextMode(fabricCanvas);
                    enableArrowDrawing(fabricCanvas);
                });
            }

            if(key == "addText"){
                el.addEventListener("click", () => {
                    console.log("Add Text Clicked!");

                    el.textContent = button.toggleText;
                    disableArrowMode(fabricCanvas);
                    enableTextTool(fabricCanvas);
                });
            }

            if (key == "closePopup") {
                el.addEventListener("click", () => {
                    console.log("Close Popup Clicked!");

                    
                    
                    createBugFinderUI("remove");
                    util.widgetButton();
                    //document.getElementById("startSelection").addEventListener("click", startSelection);
                });
            }

            

            document.querySelector(".bug-finder-controls").appendChild(el);

        });

        

        

       

        
        
    });

    stopSelection();
}




export function stopSelection() {
    document.removeEventListener("mousedown", startSelectionBox);
    document.removeEventListener("mousemove", updateSelectionBox);
    document.removeEventListener("mouseup", stopSelection);
}
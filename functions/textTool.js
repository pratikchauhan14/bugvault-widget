export function enableTextTool(fabricCanvas) {
    if (!fabricCanvas) {
        console.error("Fabric canvas is not initialized.");
        return;
    }

    // ✅ Set cursor to text input mode
    fabricCanvas.defaultCursor = "text";
    document.getElementById("addText").innerText = "Click to Add Text";

    // ✅ Add event listener for text placement
    fabricCanvas.once("mouse:down", (event) => {
        const pointer = fabricCanvas.getPointer(event.e);

        // ✅ Detect background brightness at the clicked position
        const textColor = getTextColorBasedOnBackground(fabricCanvas, pointer.x, pointer.y);

        // ✅ Create text at the clicked position
        const textObject = new fabric.Textbox("Enter text here", {
            left: pointer.x,
            top: pointer.y,
            fontSize: 20,
            fill: textColor,
            fontFamily: "Arial",
            editable: true,
            selectable: true,
            evented: true,
            width: 150,
        });

        fabricCanvas.add(textObject);
        fabricCanvas.setActiveObject(textObject);
        fabricCanvas.renderAll();

        // ✅ Automatically disable text mode after adding text
        disableTextMode(fabricCanvas);
    });

    // ✅ Call the function to listen for the Delete key
    deleteTextOnDeleteKey(fabricCanvas);
}

// ✅ Function to disable text mode after adding text
export function disableTextMode(fabricCanvas) {
    document.getElementById("addText").innerText = "Add Text";
    fabricCanvas.defaultCursor = "default";
    fabricCanvas.off("mouse:down");
    fabricCanvas.off("mouse:move");
    fabricCanvas.off("mouse:up");
}




// ✅ Function to detect background brightness and set text color
function getTextColorBasedOnBackground(fabricCanvas, x, y) {
    const ctx = fabricCanvas.getContext("2d"); 
    const pixelData = ctx.getImageData(x, y, 1, 1).data;
    
    // Calculate brightness using the formula: (R*0.299 + G*0.587 + B*0.114)
    const brightness = (pixelData[0] * 0.299) + (pixelData[1] * 0.587) + (pixelData[2] * 0.114);
    
    return brightness < 128 ? "white" : "black"; // If dark, use white text; if light, use black text
}

// ✅ Function to delete selected text when Delete key is pressed
export function deleteTextOnDeleteKey(fabricCanvas) {
    document.addEventListener("keydown", (event) => {
        if (event.key === "Delete") {
            const activeObject = fabricCanvas.getActiveObject();
            if (activeObject && activeObject.type === "textbox") {
                fabricCanvas.remove(activeObject);
                fabricCanvas.renderAll();
            }
        }
    });
}

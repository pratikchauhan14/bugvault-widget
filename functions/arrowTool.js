export function enableArrowDrawing(fabricCanvas) {
    if (!fabricCanvas) {
        console.error("Fabric canvas is not initialized.");
        return;
    }

    let arrowStart = null;
    let tempLine = null;

    // ✅ Lock the background image
    fabricCanvas.forEachObject((obj) => {
        if (obj.type === "image") {
            obj.set({ selectable: false, evented: false });
        }
    });

    // ✅ Set Arrow Mode ON with a Pen cursor
    document.getElementById("toggleArrow").innerText = "Arrow Mode: ON";
    fabricCanvas.defaultCursor = "url('https://cdn-icons-png.flaticon.com/512/1828/1828884.png'), auto";

    // Start Drawing Arrow
    fabricCanvas.on("mouse:down", (event) => {
        arrowStart = fabricCanvas.getPointer(event.e);
        
        // ✅ Show a preview line while dragging
        tempLine = new fabric.Line([arrowStart.x, arrowStart.y, arrowStart.x, arrowStart.y], {
            stroke: "red",
            strokeWidth: 2,
            selectable: false,
            evented: false,
        });

        fabricCanvas.add(tempLine);
    });

    // ✅ Update the preview arrow as the mouse moves
    fabricCanvas.on("mouse:move", (event) => {
        if (!arrowStart || !tempLine) return;
        const pointer = fabricCanvas.getPointer(event.e);
        tempLine.set({ x2: pointer.x, y2: pointer.y });
        fabricCanvas.renderAll();
    });

    // ✅ Finish drawing the arrow
    fabricCanvas.once("mouse:up", (event) => {
        if (!arrowStart) return;

        const arrowEnd = fabricCanvas.getPointer(event.e);
        fabricCanvas.remove(tempLine);
        createArrowGroup(fabricCanvas, arrowStart.x, arrowStart.y, arrowEnd.x, arrowEnd.y);

        // ✅ Automatically turn OFF arrow mode after drawing one arrow
        disableArrowMode(fabricCanvas);
    });

    // ✅ Enable delete functionality
    enableArrowDeletion(fabricCanvas);
}

// Function to disable arrow mode after drawing
export function disableArrowMode(fabricCanvas) {
    document.getElementById("toggleArrow").innerText = "Enable Arrow";
    fabricCanvas.defaultCursor = "default";
    fabricCanvas.off("mouse:down");
    fabricCanvas.off("mouse:move");
    fabricCanvas.off("mouse:up");
}

// ✅ Function to create a grouped arrow (line + arrowheads)
function createArrowGroup(fabricCanvas, fromX, fromY, toX, toY) {
    const headLen = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    const line = new fabric.Line([fromX, fromY, toX, toY], {
        stroke: "red",
        strokeWidth: 3,
        selectable: false,
        evented: false,
    });

    const arrowHead1 = new fabric.Line(
        [toX, toY, toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6)], {
        stroke: "red",
        strokeWidth: 3,
        selectable: false,
        evented: false,
    });

    const arrowHead2 = new fabric.Line(
        [toX, toY, toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6)], {
        stroke: "red",
        strokeWidth: 3,
        selectable: false,
        evented: false,
    });

    const arrowGroup = new fabric.Group([line, arrowHead1, arrowHead2], {
        selectable: true,
        evented: true,
        lockScalingFlip: true,
    });

    fabricCanvas.add(arrowGroup);
    fabricCanvas.renderAll();
}

// ✅ Function to enable arrow deletion
function enableArrowDeletion(fabricCanvas) {
    document.addEventListener("keydown", (event) => {
        if (event.key === "Delete" || event.key === "Backspace") {
            const activeObject = fabricCanvas.getActiveObject();
            if (activeObject && activeObject.type === "group") {
                fabricCanvas.remove(activeObject);
                fabricCanvas.renderAll();
            }
        }
    });
}
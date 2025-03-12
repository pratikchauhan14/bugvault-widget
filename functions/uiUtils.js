export function createBugFinderUI( type = "create") {
    if (type === "create") {
    document.body.innerHTML += `
        <div class="bug-finder-container" >
            <div class="bug-finder-controls"></div>
            <div class="bug-finder-canvas-container"></div>
            <div class="bug-finder-form"></div>
        </div>
    `;
    }
    if (type === "remove") {
        document.querySelector(".bug-finder-container").remove();
    }
}

// Function to create control buttons dynamically
export function addControlButton(id, text) {
    const parentElement = document.querySelector(".bug-finder-controls");
    if (!parentElement) return;
    parentElement.innerHTML += `
        <button id="${id}" class="bug-finder-btn">${text}</button>
    `;

}

export function CreatewidgetButton({ id, text, onClick }) {
    const button = document.createElement("button");
    const buttonStyle = `
        color: #fff;
        cursor: pointer;
        background-color: #007bff;
        border: none;
        padding: 10px 15px;
        position: absolute;
        top: 20px;
        left: 20px;
        z-index: 9999;
    `;

    button.style.cssText = buttonStyle;
    button.id = id;
    button.textContent = text;
    button.addEventListener("click", onClick);
    document.body.appendChild(button);
}

export function createBugControl (id, text, onClick){
    const button = document.createElement("button");
    button.id = id;
    button.textContent = text;
    button.addEventListener("click", onClick);
    
    return button;
}
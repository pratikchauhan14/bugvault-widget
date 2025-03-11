export function createBugFinderUI( type = "create") {
    if (type === "create") {
    document.body.innerHTML += `
        <div class="bug-finder-container" style="display:none;">
            <div class="bug-finder-controls"></div>
            <div class="bug-finder-canvas-container"></div>
            <div class="bug-finder-form"></div>
        </div>
    `;
    }else{
        // remove bug-finder-container
        document.querySelector(".bug-finder-container").remove();
    }
}

// Function to create control buttons dynamically
// export function addControlButton(id, text, onClick) {
//     const controlsContainer = document.querySelector(".bug-finder-controls");
//     if (!controlsContainer) return;

//     controlsContainer.innerHTML += `
//         <button id="${id}" class="bug-finder-btn">${text}</button>
//     `;

//     document.getElementById(id).addEventListener("click", onClick);
// }


// Function to create control buttons dynamically
export function addControlButton(id, text, onClick) {
    // If the id is "startSelection", append the button to the root (document.body)
    const parentElement = id === "startSelection" ? document.body : document.querySelector(".bug-finder-controls");

    if (!parentElement) return;

    parentElement.innerHTML += `
        <button id="${id}" class="bug-finder-btn">${text}</button>
    `;

    document.getElementById(id).addEventListener("click", onClick);
}
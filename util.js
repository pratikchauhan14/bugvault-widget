import { startSelection } from "./functions/captureScreen";
import { CreatewidgetButton } from "./functions/uiUtils";

export default util = {
    widgetButton() {
        CreatewidgetButton({
            id: "startSelection1",
            text: "Start Selection",
            onClick: startSelection
        });
    },
    control: {
        arrow: {
            enabled: true,
            id: "toggleArrow1",
            text: "Enable Arrow",
            toggleText: "Arrow Mode: ON",
        },
        addText: {
            enabled: true,
            id: "addText1",
            text: "Add Text",
            toggleText: "Click to Add Text",
        },
        closePopup: {
            enabled: true,
            id: "closePopup1",
            text: "Close",
            toggleText: "Close",
        }
    }
};
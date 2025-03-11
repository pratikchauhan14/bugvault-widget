import { createBugFinderUI, addControlButton } from "./functions/uiUtils.js";
import { startSelection } from "./functions/captureScreen.js";


addControlButton("startSelection", "Start Selection", startSelection);
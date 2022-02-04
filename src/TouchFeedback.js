import Touch from './Assets/sounds/touch.wav';

import SoundManager from './SoundManager';
import Logger from "./Logger";

function OnMouseDown(e) {
    if (e.buttons == 1)
        SoundManager.Play(Touch);
}

// detect on mouse down
function Init() {
    document.addEventListener('mousedown', OnMouseDown);
    document.addEventListener('touchstart', OnMouseDown);

    Logger.Success('TouchFeedback initialized');
}

export default {
    Init
};
import Touch from './Assets/sounds/touch.wav';

import SoundManager from './SoundManager';
import Logger from "./Logger";

import ConfigManager from './ConfigManager';

function OnMouseDown(e) {
    if (ConfigManager.touch_beep.value && e.buttons == 1)
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
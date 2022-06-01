import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import DebugBuild from './DebugBuild/DebugBuild';
import DebugInfo from './DebugBuild/DebugInfo';
import AuthPage from './Menu/AuthPage';
import PopupManager from './PopupManager';
import SessionManager from './SessionManager';
import Router from './Router';
import TouchFeedback from './TouchFeedback';
import InputManager from './InputManager';
import ExtDisplayManager from './ExtDisplayManager';
import AspectRatio from './AspectRatio';

async function onUnload() {
    await ExtDisplayManager.Destroy();
    SessionManager.DestroyCurrent();
}

async function main() {
    window.addEventListener("beforeunload", onUnload);

    SessionManager.Init();
    TouchFeedback.Init();
    InputManager.Init();

    ReactDOM.render(
        <React.StrictMode>
            <AspectRatio>
                <React.Fragment>
                    <PopupManager />
                    <DebugInfo />
                    <DebugBuild />
                    <Router />
                </React.Fragment>
            </AspectRatio>
        </React.StrictMode>,
        document.getElementById('root')
    );

    await ExtDisplayManager.Init();

    Router.RenderComponent(<AuthPage />);
}

main();
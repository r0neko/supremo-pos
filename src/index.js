import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import MenuPage from './Menu/MenuPage';
import DebugBuild from './DebugBuild/DebugBuild';
import SaleModeNew from './SaleMode/SaleModeNew';
import AuthPage from './Menu/AuthPage';
import PopupManager from './PopupManager';
import SessionManager from './SessionManager';
import Router from './Router';

SessionManager.Init();

ReactDOM.render(
    <React.StrictMode>
        <React.Fragment>
            <PopupManager />
            <DebugBuild />
            <Router />
        </React.Fragment>
    </React.StrictMode> ,
    document.getElementById('root')
);

Router.RenderComponent(<AuthPage />);
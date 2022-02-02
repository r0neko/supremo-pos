import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import ModalFormPage from './ModalForm/ModalFormPage';
import DebugBuild from './DebugBuild/DebugBuild';
import SaleModeNew from './SaleMode/SaleModeNew';
import PopupManager from './PopupManager';

ReactDOM.render(
    <React.StrictMode>
        <React.Fragment>
            <PopupManager />
            <DebugBuild />
            <SaleModeNew />
        </React.Fragment>
    </React.StrictMode> ,
    document.getElementById('root')
);
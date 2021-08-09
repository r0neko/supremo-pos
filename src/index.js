import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import ModalFormPage from './ModalForm/ModalFormPage';
import DebugBuild from './DebugBuild/DebugBuild';
import SaleMode from './SaleMode/SaleMode';
import SaleModeNew from './SaleMode/SaleModeNew';

ReactDOM.render(
  <React.StrictMode>
    <React.Fragment>
      <DebugBuild />
      <SaleModeNew/>
    </React.Fragment>
  </React.StrictMode>,
  document.getElementById('root')
);

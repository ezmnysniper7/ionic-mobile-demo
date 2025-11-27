import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import './theme/variables.css';
import './theme/global.css';

import { setupIonicReact } from '@ionic/react';

setupIonicReact({
  mode: 'ios', // Force iOS UI styles across platforms
  animated: true, // Enable animations
  swipeBackEnabled: true, // Keep swipe back gesture
  hardwareBackButton: true, // Preserve Android hardware back button
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

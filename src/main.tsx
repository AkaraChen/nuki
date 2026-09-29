if (import.meta.env.DEV) {
  void import('react-grab');
}

import { Theme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import './app.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root missing');
createRoot(root).render(
  <Theme theme={neutralTheme} mode="light">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Theme>,
);

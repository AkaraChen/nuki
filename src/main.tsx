if (import.meta.env.DEV) {
  void import('react-grab');
}

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import './style.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root missing');
createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

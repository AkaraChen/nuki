import { useEffect, useLayoutEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useMatch, useNavigate, useNavigationType } from 'react-router';
import { BootDialog } from './components/BootDialog';
import { DropOverlay } from './components/DropOverlay';
import { HOME_PATH, bindNavigate } from './cutout/nav';
import { HomePage } from './pages/HomePage';
import { CutoutPage } from './pages/CutoutPage';
import { getRuntime, useCutoutStore } from './store/cutout-store';

let sessionStarted = false;

export function App() {
  const bootOpen = useCutoutStore((s) => s.bootOpen);
  const onCutout = useMatch('/cutout');
  const navigate = useNavigate();
  const location = useLocation();
  const navType = useNavigationType();

  useLayoutEffect(() => {
    document.body.classList.toggle('mode-upload', !onCutout);
    document.body.classList.toggle('mode-editor', !!onCutout);
  }, [onCutout]);

  useLayoutEffect(() => {
    return bindNavigate((to, opts) => navigate(to, opts));
  }, [navigate]);

  useLayoutEffect(() => {
    if (sessionStarted) return;
    sessionStarted = true;
    getRuntime().start();
  }, []);

  useEffect(() => {
    if (location.pathname === HOME_PATH && navType === 'POP' && useCutoutStore.getState().mode === 'editor') {
      getRuntime().resetToUpload();
    }
  }, [location.pathname, location.key, navType]);

  useLayoutEffect(() => {
    const runtime = getRuntime();
    const onDragEnter = (e: DragEvent) => runtime.onWindowDragEnter(e);
    const onDragLeave = () => runtime.onWindowDragLeave();
    const onDragOver = (e: DragEvent) => e.preventDefault();
    const onDrop = (e: DragEvent) => runtime.onWindowDrop(e);
    const onPaste = (e: ClipboardEvent) => runtime.onPaste(e);
    const onKeyDown = (e: KeyboardEvent) => runtime.onKeyDown(e);
    const onKeyUp = (e: KeyboardEvent) => runtime.onKeyUp(e);
    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
    window.addEventListener('paste', onPaste);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
      window.removeEventListener('paste', onPaste);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <>
      <div className="app" inert={bootOpen ? true : undefined}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cutout" element={<CutoutPage />} />
          <Route path="*" element={<Navigate to={HOME_PATH} replace />} />
        </Routes>
      </div>
      <DropOverlay />
      <BootDialog />
    </>
  );
}

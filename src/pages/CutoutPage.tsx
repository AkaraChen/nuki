import { useEffect, useLayoutEffect } from 'react';
import { Navigate } from 'react-router';
import { AdvancedDialog } from '../components/AdvancedDialog';
import { Toolstrip } from '../components/Toolstrip';
import { HOME_PATH } from '../cutout/nav';
import { host } from '../cutout/host';
import { getRuntime, useCutoutStore } from '../store/cutout-store';

export function CutoutPage() {
  const tab = useCutoutStore((s) => s.tab);
  const downloadsDisabled = useCutoutStore((s) => s.downloadsDisabled);
  const imgSrc = useCutoutStore((s) => s.imgSrc);
  const compareHidden = useCutoutStore((s) => s.compareHidden);
  const checkerOn = useCutoutStore((s) => s.checkerOn);
  const handleHidden = useCutoutStore((s) => s.handleHidden);
  const busyHidden = useCutoutStore((s) => s.busyHidden);
  const busyText = useCutoutStore((s) => s.busyText);
  const imgClip = useCutoutStore((s) => s.imgClip);
  const canvasClip = useCutoutStore((s) => s.canvasClip);
  const frameW = useCutoutStore((s) => s.frameW);
  const frameH = useCutoutStore((s) => s.frameH);
  const view = useCutoutStore((s) => s.view);
  const splitAt = useCutoutStore((s) => s.splitAt);
  const stageHint = useCutoutStore((s) => s.stageHint);
  const timings = useCutoutStore((s) => s.timings);
  const dropzoneDragover = useCutoutStore((s) => s.dropzoneDragover);
  const dropzoneBrushOn = useCutoutStore((s) => s.dropzoneBrushOn);
  const dropzonePanning = useCutoutStore((s) => s.dropzonePanning);
  const dropzoneIsPanning = useCutoutStore((s) => s.dropzoneIsPanning);
  const brushCursor = useCutoutStore((s) => s.brushCursor);

  useLayoutEffect(() => {
    document.body.classList.add('mode-editor');
    document.body.classList.remove('mode-upload');
    if (imgSrc) getRuntime().presentEditor();
  }, [imgSrc]);

  useEffect(() => {
    const el = host.dropzone;
    if (!el) return;
    const ro = new ResizeObserver(() => getRuntime().fitFrame());
    ro.observe(el);
    const onWheel = (e: WheelEvent) => getRuntime().onWheel(e);
    el.addEventListener('wheel', onWheel, { passive: false });
    const onResize = () => getRuntime().fitFrame();
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  if (!imgSrc) return <Navigate to={HOME_PATH} replace />;

  const dropClass = [
    'dropzone',
    dropzoneDragover ? 'dragover' : '',
    dropzoneBrushOn ? 'brush-on' : '',
    dropzonePanning ? 'panning' : '',
    dropzoneIsPanning ? 'is-panning' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <header className="topbar">
        <button type="button" className="brand" id="btn-back" data-testid="btn-back" aria-label="返回首页" onClick={() => getRuntime().leaveToHome()}>
          <span className="logo" aria-hidden="true">
            <svg viewBox="0 0 28 28" width="28" height="28" fill="none">
              <path d="M16.5 7.5 9 14l7.5 6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 14h9.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="wordmark">抠图台</span>
        </button>
        <nav className="editor-tabs" id="editor-tabs" role="tablist" aria-label="编辑工具">
          <button
            type="button"
            role="tab"
            data-tab="cutout"
            className={tab === 'cutout' ? 'active' : undefined}
            aria-selected={tab === 'cutout'}
            onClick={() => getRuntime().setTab('cutout')}
          >
            抠图
          </button>
          <button
            type="button"
            role="tab"
            data-tab="background"
            className={tab === 'background' ? 'active' : undefined}
            aria-selected={tab === 'background'}
            onClick={() => getRuntime().setTab('background')}
          >
            背景
          </button>
          <button
            type="button"
            role="tab"
            data-tab="adjust"
            className={tab === 'adjust' ? 'active' : undefined}
            aria-selected={tab === 'adjust'}
            onClick={() => getRuntime().setTab('adjust')}
          >
            调整
          </button>
          <button type="button" id="btn-advanced" data-testid="btn-advanced" aria-haspopup="dialog" onClick={() => getRuntime().openAdvanced()}>
            高级
          </button>
        </nav>
        <div className="top-actions">
          <div className="header-download">
            <button
              id="btn-download"
              className="primary pill"
              disabled={downloadsDisabled}
              data-testid="btn-download"
              onClick={() => getRuntime().downloadResult()}
            >
              下载
            </button>
          </div>
        </div>
      </header>
      <Toolstrip />
      <AdvancedDialog />
      <main className="workspace">
        <section className="stage">
          <div
            className={dropClass}
            id="dropzone"
            data-testid="dropzone"
            ref={(el) => {
              host.dropzone = el;
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              useCutoutStore.setState({ dropzoneDragover: true });
            }}
            onDragOver={(e) => {
              e.preventDefault();
              useCutoutStore.setState({ dropzoneDragover: true });
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              useCutoutStore.setState({ dropzoneDragover: false });
            }}
            onDrop={(e) => {
              e.preventDefault();
              useCutoutStore.setState({ dropzoneDragover: false });
            }}
          >
            <div
              className="compare"
              id="compare"
              data-testid="compare"
              hidden={compareHidden}
              ref={(el) => {
                host.compare = el;
              }}
              onPointerMove={(e) => getRuntime().onComparePointerMove(e.nativeEvent)}
              onPointerDown={(e) => getRuntime().onComparePointerDown(e.nativeEvent)}
              onPointerUp={(e) => getRuntime().endStroke(e.nativeEvent)}
              onPointerCancel={(e) => getRuntime().endStroke(e.nativeEvent)}
              onLostPointerCapture={(e) => getRuntime().onLostCapture(e.nativeEvent)}
              onPointerLeave={() => getRuntime().hideCursorIfIdle()}
            >
              <div
                className="frame"
                id="frame"
                ref={(el) => {
                  host.frame = el;
                }}
                style={{
                  width: frameW ? `${frameW}px` : undefined,
                  height: frameH ? `${frameH}px` : undefined,
                  transformOrigin: 'center center',
                  transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
                }}
              >
                <div className="checker" id="checker" style={{ display: checkerOn ? 'block' : 'none' }} />
                <img id="img-original" alt="原图" src={imgSrc} ref={(el) => { host.img = el; }} style={{ clipPath: imgClip }} />
                <canvas id="canvas-result" data-testid="canvas-result" ref={(el) => { host.canvas = el; }} style={{ clipPath: canvasClip }} />
                <div
                  className="handle"
                  id="handle"
                  hidden={handleHidden}
                  ref={(el) => {
                    host.handle = el;
                  }}
                  style={{ left: `${splitAt * 100}%` }}
                  onPointerDown={(e) => getRuntime().onHandlePointerDown(e.nativeEvent)}
                  onPointerMove={(e) => getRuntime().onHandlePointerMove(e.nativeEvent)}
                  onPointerUp={(e) => getRuntime().onHandlePointerUp(e.nativeEvent)}
                >
                  <span />
                </div>
              </div>
            </div>
            <div className="busy" id="busy" hidden={busyHidden} role="status" aria-live="polite" data-testid="cutout-busy">
              <div className="busy-card">
                <span className="spinner" />
                <span id="busy-text">{busyText}</span>
              </div>
            </div>
            <div
              id="brush-cursor"
              className={`brush-cursor source-sam${brushCursor.erase ? ' kind-erase' : ''}${brushCursor.restore ? ' kind-restore' : ''}`}
              hidden={brushCursor.hidden}
              style={{
                width: `${brushCursor.width}px`,
                height: `${brushCursor.height}px`,
                left: `${brushCursor.left}px`,
                top: `${brushCursor.top}px`,
              }}
            />
          </div>
          <div className="stage-footer">
            <div className="zoom-dock">
              <button type="button" id="btn-zoom-out" title="缩小" onClick={() => getRuntime().zoomOut()}>
                −
              </button>
              <button type="button" id="btn-zoom-reset" title="100%" onClick={() => getRuntime().zoomReset()}>
                {`${Math.round(view.zoom * 100)}%`}
              </button>
              <button type="button" id="btn-zoom-in" title="放大" onClick={() => getRuntime().zoomIn()}>
                +
              </button>
            </div>
            <p className="hint center" id="stage-hint">
              {stageHint}
            </p>
            <p className="hint timings" id="timings">
              {timings}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Spinner } from '@astryxdesign/core/Spinner';
import { Text } from '@astryxdesign/core/Text';
import { useEffect, useLayoutEffect } from 'react';
import { Navigate } from 'react-router';
import mark from '../../docs/brand/mark.svg';
import { AdvancedDialog } from '../components/AdvancedDialog';
import { Toolstrip } from '../components/Toolstrip';
import { HOME_PATH } from '../cutout/nav';
import { host } from '../cutout/host';
import type { EditorTab } from '../cutout/types';
import { getRuntime, useCutoutStore } from '../store/cutout-store';

const checkerTiles =
  'bg-[linear-gradient(45deg,var(--color-border)_25%,transparent_25%),linear-gradient(-45deg,var(--color-border)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,var(--color-border)_75%),linear-gradient(-45deg,transparent_75%,var(--color-border)_75%)]';

const handleKnob =
  "absolute top-1/2 left-1/2 size-8 -translate-1/2 rounded-full bg-accent-bg shadow-sm before:absolute before:top-1/2 before:left-2 before:-mt-1 before:border-y-4 before:border-y-transparent before:border-r-[5px] before:border-r-on-accent before:content-[''] after:absolute after:top-1/2 after:right-2 after:-mt-1 after:border-y-4 after:border-y-transparent after:border-l-[5px] after:border-l-on-accent after:content-['']";

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
    'relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-muted',
    checkerTiles,
    'bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0]',
    dropzoneDragover ? 'outline outline-[3px] outline-offset-2 outline-accent-bg' : '',
    dropzoneBrushOn && !dropzonePanning ? 'cursor-none' : '',
    dropzonePanning && !dropzoneIsPanning ? 'cursor-grab! [&_*]:cursor-grab!' : '',
    dropzoneIsPanning ? 'cursor-grabbing! [&_*]:cursor-grabbing!' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const brushRing = brushCursor.erase
    ? 'border-error shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-error)_55%,black)]'
    : brushCursor.restore
      ? 'border-success shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-success)_55%,black)]'
      : 'border-white shadow-[0_0_0_1px_rgba(0,0,0,0.55)]';

  return (
    <>
      <header className="z-20 flex min-h-18 shrink-0 items-center gap-4 border-b border-border bg-surface px-6 max-[860px]:h-auto max-[860px]:flex-wrap max-[860px]:px-3 max-[860px]:py-2">
        <button
          id="btn-back"
          data-testid="btn-back"
          type="button"
          aria-label="返回首页"
          className="flex w-40 shrink-0 items-center gap-2 text-primary max-[860px]:w-auto"
          onClick={() => getRuntime().leaveToHome()}
        >
          <svg viewBox="0 0 16 16" className="size-4 shrink-0" fill="none" aria-hidden="true">
            <path d="M10 3.5 5.5 8 10 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <img className="block size-7" src={mark} alt="" width={28} height={28} />
          <Text type="large" weight="bold">nuki</Text>
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2 max-[860px]:order-3 max-[860px]:w-full max-[860px]:flex-none max-[860px]:justify-start max-[860px]:overflow-x-auto">
          <SegmentedControl
            id="editor-tabs"
            label="编辑工具"
            size="lg"
            value={tab}
            onChange={(value) => {
              if (value === 'cutout' || value === 'background' || value === 'adjust') getRuntime().setTab(value as EditorTab);
            }}
          >
            <SegmentedControlItem value="cutout" label="抠图" data-tab="cutout" />
            <SegmentedControlItem value="background" label="背景" data-tab="background" />
            <SegmentedControlItem value="adjust" label="调整" data-tab="adjust" />
          </SegmentedControl>
          <Button
            id="btn-advanced"
            data-testid="btn-advanced"
            label="高级"
            variant="secondary"
            size="lg"
            aria-haspopup="dialog"
            onClick={() => getRuntime().openAdvanced()}
          />
        </div>
        <div className="flex w-40 shrink-0 items-center justify-end max-[860px]:w-auto">
          <Button
            id="btn-download"
            data-testid="btn-download"
            label="下载"
            variant="primary"
            isDisabled={downloadsDisabled}
            onClick={() => getRuntime().downloadResult()}
          />
        </div>
      </header>
      <Toolstrip />
      <AdvancedDialog />
      <main className="flex min-h-0 flex-1 flex-col">
        <section className="relative flex min-h-0 flex-1 flex-col">
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
              className={`${compareHidden ? 'hidden' : 'flex'} absolute inset-0 z-[1] items-center justify-center${dropzoneBrushOn ? ' touch-none' : ''}`}
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
                className="relative rounded-sm shadow-md"
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
                <div
                  className={
                    checkerOn
                      ? `absolute inset-0 z-0 block overflow-hidden rounded-sm bg-surface ${checkerTiles} bg-[length:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0]`
                      : 'hidden'
                  }
                  id="checker"
                />
                <img className="z-[1] block h-full w-full rounded-sm object-contain select-none [-webkit-user-drag:none]" id="img-original" alt="原图" src={imgSrc} ref={(el) => { host.img = el; }} style={{ clipPath: imgClip }} />
                <canvas className="absolute inset-0 z-[2] h-full w-full rounded-sm" id="canvas-result" data-testid="canvas-result" ref={(el) => { host.canvas = el; }} style={{ clipPath: canvasClip }} />
                <div
                  className="absolute top-0 bottom-0 z-[3] w-0.5 -translate-x-px cursor-ew-resize touch-none bg-accent-bg"
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
                  <span className={handleKnob} />
                </div>
              </div>
            </div>
            <div
              className={
                busyHidden
                  ? 'hidden'
                  : 'absolute inset-0 z-[6] flex items-center justify-center bg-body/62 backdrop-blur-[6px]'
              }
              id="busy"
              hidden={busyHidden}
              data-testid="cutout-busy"
            >
              <Card>
                <Spinner id="busy-text" size="xl" label={busyText} />
              </Card>
            </div>
            <div
              id="brush-cursor"
              className={`pointer-events-none fixed z-[8] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] ${brushRing} after:absolute after:inset-[18%] after:rounded-full after:border after:border-dashed after:border-white/90 after:content-['']`}
              hidden={brushCursor.hidden}
              style={{
                width: `${brushCursor.width}px`,
                height: `${brushCursor.height}px`,
                left: `${brushCursor.left}px`,
                top: `${brushCursor.top}px`,
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-4 bg-body px-5 pt-2 pb-3 max-[860px]:flex-wrap">
            <div className="flex items-center">
              <Button id="btn-zoom-out" label="−" aria-label="缩小" variant="ghost" size="sm" onClick={() => getRuntime().zoomOut()} />
              <Button
                id="btn-zoom-reset"
                label={`${Math.round(view.zoom * 100)}%`}
                aria-label="100%"
                variant="ghost"
                size="sm"
                onClick={() => getRuntime().zoomReset()}
              />
              <Button id="btn-zoom-in" label="+" aria-label="放大" variant="ghost" size="sm" onClick={() => getRuntime().zoomIn()} />
            </div>
            <Text id="stage-hint" className="min-w-0 flex-1 text-center" color="secondary">{stageHint}</Text>
          </div>
        </section>
      </main>
    </>
  );
}

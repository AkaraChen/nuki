import { Button } from '@astryxdesign/core/Button';
import { CheckboxInput } from '@astryxdesign/core/CheckboxInput';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import type { SegmentedControlItemProps } from '@astryxdesign/core/SegmentedControl';
import { Slider } from '@astryxdesign/core/Slider';
import { Text } from '@astryxdesign/core/Text';
import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import type { BgMode, Tool } from '../cutout/types';
import { getRuntime, useCutoutStore } from '../store/cutout-store';

export function Toolstrip() {
  const tab = useCutoutStore((s) => s.tab);
  const tool = useCutoutStore((s) => s.tool);
  const brushRadius = useCutoutStore((s) => s.brushRadius);
  const canUndo = useCutoutStore((s) => s.canUndo);
  const canRedo = useCutoutStore((s) => s.canRedo);
  const brushDisabled = useCutoutStore((s) => s.brushDisabled);
  const brushTitle = useCutoutStore((s) => s.brushTitle);
  const bgMode = useCutoutStore((s) => s.bgMode);
  const color = useCutoutStore((s) => s.color);
  const threshold = useCutoutStore((s) => s.threshold);
  const gamma = useCutoutStore((s) => s.gamma);
  const invert = useCutoutStore((s) => s.invert);

  return (
    <div className="z-10 shrink-0 border-b border-border bg-surface px-6 py-2" id="toolstrip">
      <section className={tab === 'cutout' ? 'flex flex-wrap items-center gap-5' : 'hidden'} id="panel-cutout" data-panel="cutout" hidden={tab !== 'cutout'}>
        <div className="flex flex-col gap-1">
          <Text type="supporting" color="secondary" weight="bold">Magic Brush</Text>
          <SegmentedControl
            id="tool-modes"
            label="Magic Brush"
            value={tool}
            onChange={(value) => {
              if (value === 'compare' || value === 'erase' || value === 'restore') getRuntime().setTool(value as Tool);
            }}
          >
            <TitledSegment value="compare" label="对比" data-testid="tool-compare" data-tool="compare" />
            <TitledSegment
              value="erase"
              label="擦除"
              data-testid="tool-brush"
              data-tool="erase"
              isDisabled={brushDisabled}
              title={brushTitle}
            />
            <TitledSegment
              value="restore"
              label="恢复"
              data-testid="tool-restore"
              data-tool="restore"
              isDisabled={brushDisabled}
              title={brushTitle}
            />
          </SegmentedControl>
        </div>
        <div className="flex flex-col gap-1">
          <Text type="supporting" color="secondary">
            画笔大小 <b id="val-radius" data-testid="val-radius">{brushRadius}</b>
          </Text>
          <Slider
            id="rng-radius"
            data-testid="rng-radius"
            label="画笔大小"
            isLabelHidden
            value={brushRadius}
            min={4}
            max={160}
            step={1}
            valueDisplay="none"
            width={220}
            onChange={(value: number) => getRuntime().setRadius(value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            id="btn-undo"
            data-testid="btn-undo"
            label="撤销"
            variant="secondary"
            isDisabled={!canUndo}
            icon={<UndoIcon />}
            onClick={() => getRuntime().undo()}
          />
          <Button
            id="btn-redo"
            data-testid="btn-redo"
            label="重做"
            variant="secondary"
            isDisabled={!canRedo}
            icon={<RedoIcon />}
            onClick={() => getRuntime().redo()}
          />
        </div>
      </section>

      <section className={tab === 'background' ? 'flex flex-wrap items-center gap-5' : 'hidden'} id="panel-background" data-panel="background" hidden={tab !== 'background'}>
        <div className="flex flex-col gap-1">
          <Text type="supporting" color="secondary" weight="bold">背景</Text>
          <SegmentedControl
            id="bg-modes"
            label="背景"
            value={bgMode}
            onChange={(value) => {
              if (value === 'transparent' || value === 'color' || value === 'dim') getRuntime().setBgMode(value as BgMode);
            }}
          >
            <SegmentedControlItem value="transparent" label="透明" data-mode="transparent" />
            <SegmentedControlItem value="color" label="纯色" data-mode="color" />
            <SegmentedControlItem value="dim" label="原图变暗" data-mode="dim" />
          </SegmentedControl>
        </div>
        <div className="flex items-center gap-2" id="bg-swatches">
          <Swatch color="#ffffff" forceMode="transparent" title="透明" checker bgMode={bgMode} current={color} />
          <Swatch color="#ffffff" title="白" style={{ background: '#fff' }} bgMode={bgMode} current={color} />
          <Swatch color="#000000" title="黑" style={{ background: '#111' }} bgMode={bgMode} current={color} />
          <Swatch color="#0F70E6" title="蓝" style={{ background: '#0F70E6' }} bgMode={bgMode} current={color} /> {/* background fill swatch, not product chrome */}
          <Swatch color="#ffc83e" title="黄" style={{ background: '#ffc83e' }} bgMode={bgMode} current={color} />
          <Swatch color="#e9ebec" title="浅灰" style={{ background: '#e9ebec' }} bgMode={bgMode} current={color} />
          <Swatch color="#db1436" title="红" style={{ background: '#db1436' }} bgMode={bgMode} current={color} />
        </div>
        <label className={bgMode === 'color' ? 'flex items-center gap-2' : 'hidden'} id="color-field" hidden={bgMode !== 'color'}>
          <Text type="supporting" color="secondary">自定义</Text>
          <input id="inp-color" className="h-9 w-16 cursor-pointer rounded-md border border-border bg-surface p-1" type="color" aria-label="自定义" value={color} onChange={(e) => getRuntime().setColor(e.target.value)} />
        </label>
      </section>

      <section className={tab === 'adjust' ? 'flex flex-wrap items-center gap-5' : 'hidden'} id="panel-adjust" data-panel="adjust" hidden={tab !== 'adjust'}>
        <div className="flex flex-col gap-1">
          <Text type="supporting" color="secondary">
            阈值 <b id="val-threshold">{threshold.toFixed(2)}</b>
          </Text>
          <Slider
            id="rng-threshold"
            label="阈值"
            isLabelHidden
            value={threshold}
            min={0}
            max={0.95}
            step={0.01}
            valueDisplay="none"
            width={220}
            onChange={(value: number) => getRuntime().setAdjust({ threshold: value })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Text type="supporting" color="secondary">
            羽化 <b id="val-gamma">{gamma.toFixed(2)}</b>
          </Text>
          <Slider
            id="rng-gamma"
            label="羽化"
            isLabelHidden
            value={gamma}
            min={0.2}
            max={3}
            step={0.05}
            valueDisplay="none"
            width={220}
            onChange={(value: number) => getRuntime().setAdjust({ gamma: value })}
          />
        </div>
        <CheckboxInput id="chk-invert" label="反相遮罩" value={invert} onChange={(checked) => getRuntime().setAdjust({ invert: checked })} />
      </section>
    </div>
  );
}

function TitledSegment({ title, ...props }: SegmentedControlItemProps & { title?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    if (ref.current) ref.current.title = title ?? '';
  }, [title]);
  return <SegmentedControlItem ref={ref} {...props} />;
}

function UndoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.5 8c-2.4 0-4.5 1-6 2.6L4 8v8h8l-2.6-2.5A6.5 6.5 0 1 1 12.5 21H11v-2h1.5a4.5 4.5 0 1 0 0-11Z"
      />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11.5 8c2.4 0 4.5 1 6 2.6L20 8v8h-8l2.6-2.5A6.5 6.5 0 1 0 11.5 21H13v-2h-1.5a4.5 4.5 0 1 1 0-11Z"
      />
    </svg>
  );
}

function Swatch({
  color,
  title,
  style,
  checker,
  forceMode,
  bgMode,
  current,
}: {
  color: string;
  title: string;
  style?: CSSProperties;
  checker?: boolean;
  forceMode?: string;
  bgMode: string;
  current: string;
}) {
  const on =
    forceMode === 'transparent' ? bgMode === 'transparent' : bgMode === 'color' && color.toLowerCase() === current.toLowerCase();
  return (
    <button
      type="button"
      className={[
        'size-7 cursor-pointer rounded-full border-2 border-surface p-0',
        on ? 'ring-2 ring-accent-bg' : 'ring-1 ring-border',
        checker
          ? 'bg-surface bg-[linear-gradient(45deg,var(--color-border)_25%,transparent_25%),linear-gradient(-45deg,var(--color-border)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,var(--color-border)_75%),linear-gradient(-45deg,transparent_75%,var(--color-border)_75%)] bg-[length:10px_10px] bg-[position:0_0,0_5px,5px_-5px,-5px_0]'
          : '',
      ].join(' ')}
      data-color={color}
      data-force-mode={forceMode}
      title={title}
      style={style}
      onClick={() => getRuntime().pickSwatch(color, forceMode)}
    />
  );
}

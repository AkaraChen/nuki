import { Badge, type BadgeVariant } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { Layout, LayoutContent } from '@astryxdesign/core/Layout';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { Selector } from '@astryxdesign/core/Selector';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { useLayoutEffect, useState } from 'react';
import { DTYPE_OPTIONS, MODEL_OPTIONS } from '../cutout/runtime';
import { host } from '../cutout/host';
import { getRuntime, useCutoutStore } from '../store/cutout-store';

export function AdvancedDialog() {
  const modelId = useCutoutStore((s) => s.modelId);
  const dtype = useCutoutStore((s) => s.dtype);
  const device = useCutoutStore((s) => s.device);
  const modelNote = useCutoutStore((s) => s.modelNote);
  const progressHidden = useCutoutStore((s) => s.progressHidden);
  const progressPct = useCutoutStore((s) => s.progressPct);
  const progressLabel = useCutoutStore((s) => s.progressLabel);
  const badgeDevice = useCutoutStore((s) => s.badgeDevice);
  const badgeDeviceClass = useCutoutStore((s) => s.badgeDeviceClass);
  const badgeModel = useCutoutStore((s) => s.badgeModel);
  const badgeModelClass = useCutoutStore((s) => s.badgeModelClass);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const proxy = document.createElement('dialog');
    proxy.showModal = () => setOpen(true);
    proxy.close = () => setOpen(false);
    host.advDialog = proxy;
    return () => {
      if (host.advDialog === proxy) host.advDialog = null;
    };
  }, []);

  return (
    <Dialog
      id="adv-dialog"
      data-testid="adv-dialog"
      isOpen={open}
      purpose="info"
      width={460}
      onOpenChange={(next) => {
        if (!next) getRuntime().closeAdvanced();
      }}
    >
      <Layout
        header={
          <DialogHeader
            title="高级设置"
            onOpenChange={(next) => {
              if (!next) getRuntime().closeAdvanced();
            }}
          />
        }
        content={
          <LayoutContent>
            <Stack gap={4}>
              <Stack gap={2}>
                <Text type="supporting" color="secondary" weight="bold">模型</Text>
                <Selector
                  id="sel-model"
                  label="识别模型"
                  isLabelHidden
                  value={modelId}
                  options={MODEL_OPTIONS.map((m) => ({ value: m.id, label: m.label }))}
                  onChange={(value) => getRuntime().setModelId(value)}
                />
                <Text id="model-note" className="max-w-[260px]" type="supporting" color="secondary">{modelNote}</Text>
              </Stack>
              <Stack gap={2}>
                <Text type="supporting" color="secondary" weight="bold">运行方式</Text>
                <div className="flex w-full gap-2 [&>*]:min-w-0 [&>*]:flex-1">
                  <Selector
                    id="sel-device"
                    label="后端"
                    isLabelHidden
                    value={device}
                    options={[
                      { value: 'auto', label: '自动后端' },
                      { value: 'webgpu', label: 'WebGPU' },
                      { value: 'wasm', label: 'WASM (CPU)' },
                    ]}
                    onChange={(value) => getRuntime().setDevice(value)}
                  />
                  <Selector
                    id="sel-dtype"
                    label="精度"
                    isLabelHidden
                    value={dtype}
                    options={DTYPE_OPTIONS.map((d) => ({ value: d.id, label: d.label }))}
                    onChange={(value) => getRuntime().setDtype(value)}
                  />
                </div>
              </Stack>
              <Stack gap={2}>
                <Text type="supporting" color="secondary" weight="bold">会话</Text>
                <div className="flex items-center gap-2">
                  <Button id="btn-load" label="载入模型" variant="primary" size="sm" onClick={() => void getRuntime().loadClicked()} />
                  <Button id="btn-release" label="释放" variant="ghost" size="sm" onClick={() => getRuntime().releaseClicked()} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge id="badge-device" label={badgeDevice} variant={badgeVariant(badgeDeviceClass)} />
                  <Badge id="badge-model" label={badgeModel} variant={badgeVariant(badgeModelClass)} />
                </div>
                <ProgressBar
                  id="progress"
                  hidden={progressHidden}
                  label={progressLabel || '正在下载…'}
                  value={progressPct}
                />
              </Stack>
            </Stack>
          </LayoutContent>
        }
      />
    </Dialog>
  );
}

function badgeVariant(className: string): BadgeVariant {
  if (className.includes('ok')) return 'success';
  if (className.includes('warn')) return 'warning';
  return 'neutral';
}

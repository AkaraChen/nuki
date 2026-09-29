import { Button } from '@astryxdesign/core/Button';
import { Dialog } from '@astryxdesign/core/Dialog';
import { Heading } from '@astryxdesign/core/Heading';
import { Layout, LayoutContent } from '@astryxdesign/core/Layout';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { Spinner } from '@astryxdesign/core/Spinner';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { MODEL_OPTIONS } from '../cutout/runtime';
import { getRuntime, useCutoutStore } from '../store/cutout-store';

export function BootDialog() {
  const open = useCutoutStore((s) => s.bootOpen);
  const error = useCutoutStore((s) => s.bootError);
  const modelId = useCutoutStore((s) => s.modelId);
  const progressHidden = useCutoutStore((s) => s.progressHidden);
  const progressPct = useCutoutStore((s) => s.progressPct);
  const progressLabel = useCutoutStore((s) => s.progressLabel);
  if (!open) return null;

  const model = MODEL_OPTIONS.find((m) => m.id === modelId);
  const title = error ? '模型没有准备好' : '正在准备模型';

  return (
    <Dialog
      isOpen
      purpose="required"
      width={380}
      data-testid="boot-dialog"
      aria-labelledby="boot-title"
      aria-busy={!error}
      onOpenChange={() => {}}
    >
      <Layout
        content={
          <LayoutContent>
            <Stack gap={3} align="center">
              {error ? null : <Spinner size="xl" aria-label="正在准备模型" />}
              <Heading id="boot-title" level={2}>{title}</Heading>
              <Text color="secondary">{error ? error : '先把所选模型准备好，再开始。'}</Text>
              {model ? <Text weight="semibold">{model.label}</Text> : null}
              {error ? (
                <Button label="重试" variant="primary" data-testid="boot-retry" onClick={() => getRuntime().retryBoot()} />
              ) : (
                <ProgressBar hidden={progressHidden} label={progressLabel || '正在下载…'} value={progressPct} />
              )}
            </Stack>
          </LayoutContent>
        }
      />
    </Dialog>
  );
}

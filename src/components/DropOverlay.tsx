import { Card } from '@astryxdesign/core/Card';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { useCutoutStore } from '../store/cutout-store';

export function DropOverlay() {
  const hidden = useCutoutStore((s) => s.dropOverlayHidden);
  return (
    <div
      id="drop-overlay"
      className={
        hidden
          ? 'hidden'
          : 'fixed inset-0 z-[80] flex items-center justify-center bg-accent-bg/12 backdrop-blur-[2px]'
      }
      hidden={hidden}
    >
      <Card>
        <Stack gap={1} align="center">
          <Text type="large" weight="bold">将图片拖到这里</Text>
          <Text type="supporting" color="secondary">一次一张</Text>
        </Stack>
      </Card>
    </div>
  );
}

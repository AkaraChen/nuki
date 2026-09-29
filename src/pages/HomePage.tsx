import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { useLayoutEffect } from 'react';
import { Brand } from '../components/Brand';
import { host } from '../cutout/host';
import { getRuntime, useCutoutStore } from '../store/cutout-store';

export function HomePage() {
  const dropzoneDragover = useCutoutStore((s) => s.dropzoneDragover);

  useLayoutEffect(() => {
    document.body.classList.add('mode-upload');
    document.body.classList.remove('mode-editor');
  }, []);

  return (
    <>
      <header className="z-20 flex min-h-18 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-6 max-[860px]:h-auto max-[860px]:flex-wrap max-[860px]:px-3 max-[860px]:py-2">
        <Brand />
      </header>
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center">
        <section className="relative flex w-[min(448px,calc(100vw-48px))] flex-none flex-col max-[860px]:w-[min(100%-24px,420px)]">
          <div
            className={`relative flex min-h-80 cursor-pointer items-center justify-center overflow-hidden px-6 py-8${dropzoneDragover ? ' outline outline-[3px] outline-offset-2 outline-accent-bg' : ''}`}
            id="dropzone"
            data-testid="dropzone"
            ref={(el) => {
              host.dropzone = el;
            }}
            onClick={() => getRuntime().openFilePicker()}
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
            <input
              id="file-input"
              data-testid="file-input"
              type="file"
              accept="image/*"
              hidden
              ref={(el) => {
                host.fileInput = el;
              }}
              onChange={() => getRuntime().onFileInputChange()}
            />
            <Card className="w-full">
              <Stack gap={3} align="center">
                <Button
                  id="btn-upload"
                  data-testid="btn-upload"
                  label="上传图片"
                  variant="primary"
                  size="lg"
                  width={280}
                  onClick={(e) => {
                    e.stopPropagation();
                    getRuntime().openFilePicker();
                  }}
                />
                <Text>或拖入文件，粘贴图片</Text>
                <Text type="supporting" color="secondary">PNG / JPEG / WebP</Text>
              </Stack>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}

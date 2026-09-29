import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Heading } from '@astryxdesign/core/Heading';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { useLayoutEffect } from 'react';
import sample from '../../docs/demo/sample-input.jpg';
import cutout from '../../docs/demo/home-cutout.png';
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
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <section className="m-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-8 max-[860px]:px-4 max-[860px]:py-6">
          <Stack gap={2} align="center">
            <Heading level={1} type="display-3">去掉图片背景</Heading>
            <Text color="secondary">在这台设备上自动完成，照片不会上传。</Text>
          </Stack>
          <div
            className={`relative flex w-full max-w-xl cursor-pointer items-center justify-center${dropzoneDragover ? ' rounded-lg outline outline-[3px] outline-offset-2 outline-accent-bg' : ''}`}
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
              <Stack gap={4} align="center">
                <div className="grid w-full grid-cols-2 gap-3">
                  <figure className="flex flex-col items-center gap-2">
                    <img className="aspect-[4/3] w-full rounded-md object-cover" src={sample} alt="沙发上的两只猫" draggable={false} />
                    <Text type="supporting" color="secondary">原图</Text>
                  </figure>
                  <figure className="flex flex-col items-center gap-2">
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-surface bg-[linear-gradient(45deg,var(--color-border)_25%,transparent_25%),linear-gradient(-45deg,var(--color-border)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,var(--color-border)_75%),linear-gradient(-45deg,transparent_75%,var(--color-border)_75%)] bg-[length:12px_12px] bg-[position:0_0,0_6px,6px_-6px,-6px_0]">
                      <img className="h-full w-full object-cover" src={cutout} alt="同一张照片，背景已去掉" draggable={false} />
                    </div>
                    <Text type="supporting" color="secondary">去背景</Text>
                  </figure>
                </div>
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
                <Stack gap={1} align="center">
                  <Text>或拖入文件，粘贴图片</Text>
                  <Text type="supporting" color="secondary">PNG / JPEG / WebP</Text>
                </Stack>
              </Stack>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}

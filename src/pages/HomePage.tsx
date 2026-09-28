import { useLayoutEffect } from 'react';
import { host } from '../cutout/host';
import { Brand } from '../components/Brand';
import { getRuntime, useCutoutStore } from '../store/cutout-store';

export function HomePage() {
  const dropzoneDragover = useCutoutStore((s) => s.dropzoneDragover);

  useLayoutEffect(() => {
    document.body.classList.add('mode-upload');
    document.body.classList.remove('mode-editor');
  }, []);

  return (
    <>
      <header className="topbar">
        <Brand />
      </header>
      <main className="workspace">
        <section className="stage">
          <div
            className={dropzoneDragover ? 'dropzone dragover' : 'dropzone'}
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
            <div className="empty" id="empty">
              <div className="upload-card">
                <button
                  type="button"
                  className="btn-upload"
                  id="btn-upload"
                  onClick={(e) => {
                    e.stopPropagation();
                    getRuntime().openFilePicker();
                  }}
                >
                  上传图片
                </button>
                <p className="upload-or">或拖入文件，粘贴图片</p>
                <p className="upload-types">PNG / JPEG / WebP</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

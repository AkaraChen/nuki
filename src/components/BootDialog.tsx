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

  return (
    <div className="boot-overlay" role="dialog" aria-modal="true" aria-labelledby="boot-title" aria-busy={!error} data-testid="boot-dialog">
      <div className="boot-card">
        {error ? null : <div className="boot-spinner" aria-hidden="true" />}
        <h2 id="boot-title">{error ? '模型没有准备好' : '正在准备模型'}</h2>
        <p>{error ? error : '先下载最小的模型，准备好再开始。'}</p>
        {model ? <p className="boot-model">{model.label}</p> : null}
        {error ? (
          <button type="button" className="primary" data-testid="boot-retry" onClick={() => getRuntime().retryBoot()}>
            重试
          </button>
        ) : (
          <div className="progress" hidden={progressHidden}>
            <div className="bar">
              <i style={{ width: `${progressPct}%` }} />
            </div>
            <span className="progress-label">{progressLabel || '正在下载…'}</span>
          </div>
        )}
      </div>
    </div>
  );
}

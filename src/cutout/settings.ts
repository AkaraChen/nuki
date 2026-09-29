import { DTYPES, MODELS, modelById, smallestModel } from '../models';

const DEVICES = ['auto', 'webgpu', 'wasm'] as const;

export type CutoutSettings = {
  modelId: string;
  dtype: string;
  device: string;
};

export const SETTINGS_STORAGE_KEY = 'cutout-settings';

function browserHasWebGPU() {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

export function defaultSettings(): CutoutSettings {
  return {
    modelId: smallestModel().id,
    dtype: '__auto',
    device: browserHasWebGPU() ? 'auto' : 'wasm',
  };
}

export function sanitizeSettings(raw: unknown): CutoutSettings {
  const fallback = defaultSettings();
  if (!raw || typeof raw !== 'object') return fallback;
  const saved = raw as Record<string, unknown>;
  const modelId =
    typeof saved.modelId === 'string' && MODELS.some((model) => model.id === saved.modelId) ? saved.modelId : fallback.modelId;
  const dtype =
    saved.dtype === '__auto' || (typeof saved.dtype === 'string' && (DTYPES as readonly string[]).includes(saved.dtype))
      ? saved.dtype
      : fallback.dtype;
  const device =
    typeof saved.device === 'string' && (DEVICES as readonly string[]).includes(saved.device) ? saved.device : fallback.device;
  return { modelId, dtype, device };
}

export function readSettings(): CutoutSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return defaultSettings();
    const parsed = JSON.parse(raw) as { state?: unknown };
    return sanitizeSettings(parsed.state ?? parsed);
  } catch {
    return defaultSettings();
  }
}

export function settingsNote(modelId: string) {
  const spec = modelById(modelId);
  return spec.note;
}

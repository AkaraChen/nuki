export type DeviceKind = 'webgpu' | 'wasm';

export interface ModelSpec {
  /** Hugging Face repo id — passed straight to transformers.js */
  id: string;
  label: string;
  /** one-line description shown in the UI */
  note: string;
  kind: 'general' | 'portrait' | 'heavy';
  /** repo licence; not shown in the UI */
  license: string;
  /** on-disk size of the recommended dtype, in MB (measured from the HF API) */
  sizeMB: number;
  /** recommended dtype per backend */
  dtype: Record<DeviceKind, Dtype>;
  /** some exports want the raw logits instead of the pre-sigmoided map */
  defaultInvert?: boolean;
}

export type Dtype = 'fp32' | 'fp16' | 'q8' | 'int8' | 'uint8' | 'q4' | 'q4f16' | 'bnb4';

export const MODELS: ModelSpec[] = [
  {
    id: 'kittypdf/RMBG-1.4-transformersjs',
    label: 'RMBG-1.4',
    note: '通用抠图，人物、物品和场景都适合。',
    kind: 'general',
    license: 'bria-rmbg-1.4（非商用）',
    sizeMB: 84,
    dtype: { webgpu: 'fp16', wasm: 'q8' },
  },
  {
    id: 'onnx-community/ISNet-ONNX',
    label: 'ISNet',
    note: '通用抠图，发丝和边缘更细。',
    kind: 'general',
    license: 'AGPL-3.0',
    sizeMB: 84,
    dtype: { webgpu: 'fp16', wasm: 'q8' },
  },
  {
    id: 'Xenova/modnet',
    label: 'MODNet',
    note: '人像抠图。',
    kind: 'portrait',
    license: 'Apache-2.0',
    sizeMB: 12,
    dtype: { webgpu: 'fp16', wasm: 'q8' },
  },
  {
    id: 'jiabins0303/birefnet-lite-1024-webgpu',
    label: 'BiRefNet-lite 1024',
    note: '高分辨率抠图，细节更完整。',
    kind: 'heavy',
    license: 'MIT',
    sizeMB: 109,
    dtype: { webgpu: 'fp16', wasm: 'fp16' },
  },
];

export function modelById(id: string): ModelSpec {
  return MODELS.find((m) => m.id === id) ?? MODELS[0];
}

export function smallestModel(): ModelSpec {
  return MODELS.reduce((best, spec) => (spec.sizeMB < best.sizeMB ? spec : best));
}

export const DTYPES: Dtype[] = ['fp32', 'fp16', 'q8', 'int8', 'uint8', 'q4', 'q4f16', 'bnb4'];

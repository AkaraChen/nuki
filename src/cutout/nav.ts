export const HOME_PATH = '/';
export const CUTOUT_PATH = '/cutout';

type Go = (to: string, opts?: { replace?: boolean }) => void;

let current: Go | null = null;

export function bindNavigate(navigate: Go) {
  current = navigate;
  return () => {
    if (current === navigate) current = null;
  };
}

export function go(to: string, opts?: { replace?: boolean }) {
  current?.(to, opts);
}

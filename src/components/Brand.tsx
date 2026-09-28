import { Link } from 'react-router';

export function Brand() {
  return (
    <Link className="brand" to="/" id="btn-home" aria-label="回到上传">
      <span className="logo" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="28" height="28">
          <circle cx="16" cy="16" r="16" fill="#0F70E6" />
          <path
            fill="#fff"
            d="M16.2 8.4c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3Zm-5.3 8.2c.4-1.2 2.2-2 5.3-2s4.9.8 5.3 2l1.5 5.2c.2.6-.2 1.2-.8 1.2h-2.1l-.5 1.8c-.1.5-.6.8-1.1.6l-2.3-.8-2.3.8c-.5.2-1-.1-1.1-.6l-.5-1.8H9.2c-.6 0-1-.6-.8-1.2l1.5-5.2Z"
          />
        </svg>
      </span>
      <span className="wordmark">抠图台</span>
    </Link>
  );
}

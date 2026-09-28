import { Link } from 'react-router';
import mark from '../../docs/brand/mark.svg';

export function Brand() {
  return (
    <Link className="brand" to="/" id="btn-home" aria-label="回到上传">
      <img className="mark" src={mark} alt="" width={28} height={28} />
      <span className="wordmark">nuki</span>
    </Link>
  );
}

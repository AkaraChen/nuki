import { Text } from '@astryxdesign/core/Text';
import { Link } from 'react-router';
import mark from '../../docs/brand/mark.svg';

export function Brand() {
  return (
    <Link className="flex min-w-32 items-center gap-2 text-primary no-underline" to="/" id="btn-home" aria-label="回到上传">
      <img className="block size-7" src={mark} alt="" width={28} height={28} />
      <Text type="large" weight="bold">nuki</Text>
    </Link>
  );
}

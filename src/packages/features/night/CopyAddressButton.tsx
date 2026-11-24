'use client';

import { useState } from 'react';
import styles from '~features/night/night.module.css';

export function CopyAddressButton({
  name,
  address,
}: {
  name: string;
  address: string;
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copyAddress}
        aria-label={`${name} 주소 복사`}
      >
        {status === 'copied' ? '복사 완료' : '주소 복사'}
      </button>
      <p
        role="status"
        className={status === 'failed' ? styles.copyError : 'sr-only'}
      >
        {status === 'copied' && '주소를 복사했어요.'}
        {status === 'failed' && '위 주소를 길게 눌러 복사해 주세요.'}
      </p>
    </>
  );
}

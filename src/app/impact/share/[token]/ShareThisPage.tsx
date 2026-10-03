'use client';

import { useEffect, useState } from 'react';
import ShareButtons from '@/components/impact/ShareButtons';

export default function ShareThisPage({ message, imagePath }: { message: string; imagePath: string }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!url) return null;
  return <ShareButtons url={url} message={message} imageUrl={imagePath} tone="dark" />;
}

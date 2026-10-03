'use client';

import { useState, useEffect } from 'react';
import { FiCopy, FiCheck, FiShare2, FiDownload } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaXTwitter } from 'react-icons/fa6';

interface ShareButtonsProps {
  url: string;
  message: string;
  imageUrl?: string;
  tone?: 'light' | 'dark';
}

export default function ShareButtons({ url, message, imageUrl, tone = 'light' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  // navigator.share only exists in the browser (mostly phones), so detect it after mount
  useEffect(() => {
    setCanNativeShare(typeof navigator.share === 'function');
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(message);

  const nativeShare = async () => {
    try {
      await navigator.share({ title: 'My plastic impact', text: message, url });
    } catch {
      // Cancelled by the user
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('Copy this link:', url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const base = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition';
  const secondary = tone === 'dark'
    ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
    : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50';

  return (
    <div className="flex flex-wrap gap-2">
      {canNativeShare && (
        <button onClick={nativeShare} className={`${base} bg-emerald-500 text-white hover:bg-emerald-600`}>
          <FiShare2 className="w-4 h-4" /> Share
        </button>
      )}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${message} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} bg-[#25D366] text-white hover:brightness-95`}
      >
        <FaWhatsapp className="w-4 h-4" /> WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} bg-[#1877F2] text-white hover:brightness-95`}
      >
        <FaFacebookF className="w-4 h-4" /> Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} bg-black text-white hover:bg-slate-800`}
      >
        <FaXTwitter className="w-4 h-4" /> Post
      </a>
      <button onClick={copyLink} className={`${base} ${secondary}`}>
        {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
        {copied ? 'Copied!' : 'Copy link'}
      </button>
      {imageUrl && (
        <a href={imageUrl} download="my-plastic-impact.png" className={`${base} ${secondary}`}>
          <FiDownload className="w-4 h-4" /> Image
        </a>
      )}
    </div>
  );
}

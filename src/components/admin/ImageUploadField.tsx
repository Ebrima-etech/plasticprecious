'use client';

import { useState, useRef } from 'react';
import { HiOutlinePhoto, HiOutlineXMark } from 'react-icons/hi2';

interface ImageUploadFieldProps {
  label: string;
  value: File | null;
  preview?: string | null;
  onChange: (file: File | null) => void;
  onPreviewChange?: (preview: string | null) => void;
  accept?: string;
  maxSize?: number;
}

export function ImageUploadField({
  label,
  value,
  preview,
  onChange,
  onPreviewChange,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024 // 5MB
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (file: File) => {
    setError('');

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    onChange(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onPreviewChange?.(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const clearImage = () => {
    onChange(null);
    onPreviewChange?.(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-slate-600 block">{label}</label>

      {preview ? (
        <div className="relative inline-block">
          <div className="relative w-40 h-40 rounded-xl overflow-hidden border-2 border-emerald-200 bg-slate-100">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <HiOutlineXMark className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            {value?.name ? `Selected: ${value.name}` : 'No file selected'}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
          >
            Change Image
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
            ${dragActive
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50'
            }
          `}
        >
          <HiOutlinePhoto className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700">
            Drag and drop or click to upload
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {accept === 'image/*' ? 'PNG, JPG, GIF up to 5MB' : 'Supported formats up to 5MB'}
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}

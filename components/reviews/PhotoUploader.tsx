import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { useLanguage } from '@/lib/language';

const MAX_PHOTOS = 4;
const MAX_DIMENSION = 800;
const JPEG_QUALITY = 0.7;

function resizeToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not read image'));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

type PhotoUploaderProps = {
  photos: string[];
  onChange: (photos: string[]) => void;
};

export default function PhotoUploader({ photos, onChange }: PhotoUploaderProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const remaining = MAX_PHOTOS - photos.length;
    const next = Array.from(files).slice(0, remaining);
    const dataUrls = await Promise.all(next.map(resizeToDataUrl));
    onChange([...photos, ...dataUrls]);
    if (inputRef.current) inputRef.current.value = '';
  }

  function removeAt(index: number) {
    onChange(photos.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {photos.map((photo, i) => (
          <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label="Remove photo"
              className="absolute right-1 top-1 rounded-full bg-ink-900/70 p-1 text-white hover:bg-ink-900"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 text-ink-400 hover:border-primary-400 hover:text-primary-600"
          >
            <ImagePlus size={18} />
            <span className="text-[11px] font-medium">{t.addPhotoLabel}</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="mt-2 text-xs text-ink-400">{t.photosMaxHint.replace('{max}', String(MAX_PHOTOS))}</p>
    </div>
  );
}

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropModalProps {
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CroppedAreaPixels extends Area {}

export default function ImageCropModal({ imageSrc, onCropComplete, onCancel }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);
  const [processing, setProcessing] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState<string>('');
  const [estimatedSize, setEstimatedSize] = useState<string>('');

  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropAreaChange = useCallback(
    (_croppedArea: Area, croppedAreaPixels: CroppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: CroppedAreaPixels
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const targetSize = 400;
    canvas.width = targetSize;
    canvas.height = targetSize;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      targetSize,
      targetSize
    );

    const MAX_FILE_SIZE = 1024 * 1024;
    const qualityLevels = [0.85, 0.75, 0.65, 0.55, 0.45, 0.35];

    for (let i = 0; i < qualityLevels.length; i++) {
      const quality = qualityLevels[i];
      setCompressionStatus(`Otimizando imagem (${Math.round(quality * 100)}%)...`);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas is empty'));
            }
          },
          'image/jpeg',
          quality
        );
      });

      const sizeInKB = Math.round(blob.size / 1024);
      console.log(`Compression pass ${i + 1}: quality=${quality}, size=${sizeInKB}KB`);

      if (blob.size <= MAX_FILE_SIZE || i === qualityLevels.length - 1) {
        setEstimatedSize(`${sizeInKB} KB`);
        console.log(`Final compressed image: ${sizeInKB}KB at ${Math.round(quality * 100)}% quality`);
        return blob;
      }
    }

    throw new Error('Failed to compress image adequately');
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    setProcessing(true);
    setCompressionStatus('Processando imagem...');
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCompressionStatus('Enviando...');
      onCropComplete(croppedBlob);
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Erro ao processar imagem. Tente novamente.');
      setCompressionStatus('');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Ajustar Foto de Perfil</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="relative bg-gray-100" style={{ height: '400px' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaChange}
          />
        </div>

        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center space-x-4 mb-4">
            <ZoomOut className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <ZoomIn className="w-5 h-5 text-gray-600 flex-shrink-0" />
          </div>

          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600">
              Arraste para posicionar e use o controle para ampliar
            </p>
            {estimatedSize && !processing && (
              <p className="text-xs text-gray-500 mt-1">
                Tamanho estimado: {estimatedSize}
              </p>
            )}
            {compressionStatus && processing && (
              <p className="text-xs text-amber-600 mt-1 font-medium">
                {compressionStatus}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={processing}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition disabled:opacity-50"
            >
              {processing ? (compressionStatus || 'Processando...') : 'Salvar Foto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

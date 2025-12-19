'use client'

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Camera, Check, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
  documentSide: 'recto' | 'verso';
}

export function CameraCapture({ onCapture, onClose, documentSide }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Demander l'accès à la caméra au montage du composant
  useEffect(() => {
    async function getCameraStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } // Préfère la caméra arrière
        });
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Erreur d'accès à la caméra:", err);
        setError("Impossible d'accéder à la caméra. Veuillez vérifier les autorisations dans votre navigateur.");
      }
    }
    getCameraStream();

    // Nettoyer en arrêtant le flux vidéo à la fermeture
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImageSrc(dataUrl);
      stream?.getTracks().forEach(track => track.stop()); // Arrête le flux après la capture
    }
  };

  const handleRetake = () => {
    setImageSrc(null);
    // Relancer la caméra
    async function restartCamera() {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(newStream);
      if (videoRef.current) videoRef.current.srcObject = newStream;
    }
    restartCamera();
  };

  const handleConfirm = () => {
    if (imageSrc) {
      onCapture(imageSrc);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center"
    >
      <div className="relative w-full max-w-4xl p-4">
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 bg-white/20 rounded-full">
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative">
          {error && <div className="text-white text-center p-8">{error}</div>}
          
          {imageSrc ? (
            <img src={imageSrc} alt="Aperçu de la capture" className="w-full h-full object-contain" />
          ) : (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          )}

          {!imageSrc && <div className="absolute inset-[10%] border-4 border-white/50 border-dashed rounded-2xl" />}
        </div>

        <div className="mt-6 text-center text-white">
          <h2 className="text-2xl font-bold">
            Capture du {documentSide === 'recto' ? 'Recto' : 'Verso'} 
            <span className="font-light"> ({documentSide === 'recto' ? '1/2' : '2/2'})</span>
          </h2>
          <p>Placez le document dans le cadre et assurez un bon éclairage.</p>
        </div>

        <div className="mt-8 flex justify-center space-x-6">
          {imageSrc ? (
            <>
              <Button size="lg" variant="outline" onClick={handleRetake} className="bg-transparent text-white border-white">
                <RefreshCw className="mr-2" /> Reprendre
              </Button>
              <Button size="lg" onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
                <Check className="mr-2" /> Confirmer
              </Button>
            </>
          ) : (
            <button onClick={handleCapture} className="w-20 h-20 rounded-full bg-white flex items-center justify-center ring-4 ring-white/30">
              <Camera className="w-10 h-10 text-slate-800" />
            </button>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </motion.div>
  );
}
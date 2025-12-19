'use client'

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function FileUploader({ onFileUpload, onBack }: { onFileUpload: (file: File) => void, onBack: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const currentFile = acceptedFiles[0];
      setFile(currentFile);
      // Simuler l'upload
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => onFileUpload(currentFile), 500);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png'], 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-8 rounded-xl border border-slate-200 shadow-lg w-full"
    >
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Changer de méthode
      </Button>

      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-12 h-12 mx-auto text-slate-400" />
        <p className="mt-4 font-semibold text-slate-900">
          Glissez-déposez votre fichier ici
        </p>
        <p className="text-slate-500 text-sm">ou cliquez pour sélectionner (PDF, JPG, PNG)</p>
      </div>

      {file && (
        <div className="mt-6">
          <div className="flex items-center bg-slate-100 p-3 rounded-lg">
            <File className="w-8 h-8 text-blue-500" />
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-slate-900">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <p className="text-sm font-semibold">{progress}%</p>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
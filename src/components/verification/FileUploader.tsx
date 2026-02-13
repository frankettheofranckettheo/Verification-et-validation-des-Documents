'use client'

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, ArrowLeft, Trash2, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// --- CORRECTION CRITIQUE ---
// 1. NE PAS IMPORTER pdfjs-dist ICI !
// import * as pdfjsLib from 'pdfjs-dist';  <-- À SUPPRIMER

// --- Fonction utilitaire pour convertir la page 1 du PDF en image ---
const renderPdfToImage = async (file: File): Promise<string> => {
  
  // 2. IMPORT DYNAMIQUE : On charge la librairie UNIQUEMENT ici, côté client
  const pdfjsLib = await import('pdfjs-dist');

  // Configuration du Worker (local)
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  
  // Charger le document PDF
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  // Récupérer la première page
  const page = await pdf.getPage(1);
  
  // Définir l'échelle (1.5 pour une bonne qualité de thumbnail)
  const viewport = page.getViewport({ scale: 1.5 });
  
  // Créer un canvas en mémoire
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) throw new Error("Impossible de créer le contexte canvas");

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  // Dessiner la page PDF sur le canvas
  await page.render({
    canvasContext: context,
    canvas: canvas,
    viewport: viewport
  }).promise;

  // Convertir le canvas en URL d'image (Base64)
  return canvas.toDataURL('image/jpeg');
};

// ... LE RESTE DU FICHIER RESTE EXACTEMENT LE MÊME ...
// (SingleDropZone et FileUploader ne changent pas, sauf si vous aviez des imports PDFJS dedans)

// --- Composant interne pour une zone de dépôt unique ---
function SingleDropZone({ 
  label, 
  file, 
  onDrop, 
  onRemove 
}: { 
  label: string; 
  file: File | null; 
  onDrop: (file: File) => void; 
  onRemove: () => void; 
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Générer l'URL de prévisualisation (Image ou PDF)
  useEffect(() => {
    if (!file) {
      setPreview(null);
      setIsLoadingPreview(false);
      return;
    }

    const generatePreview = async () => {
      // 1. Si c'est une IMAGE
      if (file.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
      
      // 2. Si c'est un PDF
      if (file.type === 'application/pdf') {
        try {
          setIsLoadingPreview(true);
          const pdfImage = await renderPdfToImage(file);
          setPreview(pdfImage);
        } catch (error) {
          console.error("Erreur prévisualisation PDF:", error);
        } finally {
          setIsLoadingPreview(false);
        }
      }
    };

    generatePreview();
  }, [file]);

  const onDropCallback = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onDrop(acceptedFiles[0]);
    }
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept: { 
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'] 
    },
    maxFiles: 1,
    disabled: !!file 
  });

  const isPdf = file?.type === 'application/pdf';

  return (
    <div className="flex-1 w-full">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      
      {!file ? (
        <div
          {...getRootProps()}
          className={`h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors p-4 text-center relative
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
        >
          <input {...getInputProps()} />
          <UploadCloud className={`w-10 h-10 mb-3 ${isDragActive ? 'text-blue-500' : 'text-slate-400'}`} />
          <p className="text-sm font-medium text-slate-900">Cliquez, glissez ou Collez (Ctrl+V)</p>
          <p className="text-xs text-slate-500 mt-1">JPG, PNG, PDF</p>
        </div>
      ) : (
        <div className="h-48 border border-slate-200 rounded-lg bg-slate-50 relative flex flex-col items-center justify-center shadow-sm overflow-hidden group">
          <button 
            onClick={onRemove}
            className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shadow-sm border border-slate-200"
            title="Supprimer le fichier"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          {isLoadingPreview ? (
             <div className="flex flex-col items-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <span className="text-xs">Chargement aperçu...</span>
             </div>
          ) : preview ? (
            <img 
              src={preview} 
              alt="Prévisualisation" 
              className="w-full h-full object-contain p-2 bg-white" 
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-700 p-4">
              <div className="bg-red-100 p-4 rounded-xl mb-3">
                <FileText className="w-10 h-10 text-red-500" />
              </div>
              <p className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded mb-1">
                {isPdf ? "PDF" : "FICHIER"}
              </p>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-slate-900/70 text-white text-xs p-2 text-center truncate backdrop-blur-sm z-10">
            <span className="truncate px-2">{file.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Composant Principal (FileUploader) ---
export function FileUploader({ 
  onUploadComplete, 
  onBack 
}: { 
  onUploadComplete: (recto: File, verso: File) => void; 
  onBack: () => void; 
}) {
  const [rectoFile, setRectoFile] = useState<File | null>(null);
  const [versoFile, setVersoFile] = useState<File | null>(null);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (rectoFile && versoFile) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          const file = items[i].getAsFile();
          if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
            if (!rectoFile) setRectoFile(file);
            else if (!versoFile) setVersoFile(file);
            break; 
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [rectoFile, versoFile]);

  const handleValidate = () => {
    if (rectoFile && versoFile) {
      onUploadComplete(rectoFile, versoFile);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-8 rounded-xl border border-slate-200 shadow-lg w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-xl font-bold text-slate-900">Importation des fichiers</h2>
      </div>

      <p className="text-slate-500 mb-6 text-center">
        Importez ou collez (Ctrl+V) le recto et le verso de votre document.
      </p>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <SingleDropZone 
          label="1. Recto du document" 
          file={rectoFile} 
          onDrop={setRectoFile} 
          onRemove={() => setRectoFile(null)} 
        />
        <SingleDropZone 
          label="2. Verso du document" 
          file={versoFile} 
          onDrop={setVersoFile} 
          onRemove={() => setVersoFile(null)} 
        />
      </div>

      <div className="text-center">
        <Button 
          size="lg" 
          onClick={handleValidate} 
          disabled={!rectoFile || !versoFile}
          className={`w-full md:w-auto px-12 transition-all ${
            rectoFile && versoFile 
            ? 'bg-blue-600 hover:bg-blue-700 shadow-md transform hover:scale-105' 
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {rectoFile && versoFile ? "Lancer l'analyse" : "Importez les 2 faces"}
        </Button>
      </div>
    </motion.div>
  );
}
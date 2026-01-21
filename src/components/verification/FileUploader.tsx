// 'use client'

// import { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { UploadCloud, File, X, ArrowLeft } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { motion } from 'framer-motion';

// export function FileUploader({ onFileUpload, onBack }: { onFileUpload: (file: File) => void, onBack: () => void }) {
//   const [file, setFile] = useState<File | null>(null);
//   const [progress, setProgress] = useState(0);

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     if (acceptedFiles.length > 0) {
//       const currentFile = acceptedFiles[0];
//       setFile(currentFile);
//       // Simuler l'upload
//       const interval = setInterval(() => {
//         setProgress(prev => {
//           if (prev >= 100) {
//             clearInterval(interval);
//             setTimeout(() => onFileUpload(currentFile), 500);
//             return 100;
//           }
//           return prev + 10;
//         });
//       }, 100);
//     }
//   }, [onFileUpload]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { 'image/*': ['.jpeg', '.png'], 'application/pdf': ['.pdf'] },
//     maxFiles: 1
//   });

//   return (
//     <motion.div 
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.95 }}
//       transition={{ duration: 0.3 }}
//       className="bg-white p-8 rounded-xl border border-slate-200 shadow-lg w-full"
//     >
//       <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
//         <ArrowLeft className="w-4 h-4 mr-2" />
//         Changer de méthode
//       </Button>

//       <div
//         {...getRootProps()}
//         className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
//         ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'}`}
//       >
//         <input {...getInputProps()} />
//         <UploadCloud className="w-12 h-12 mx-auto text-slate-400" />
//         <p className="mt-4 font-semibold text-slate-900">
//           Glissez-déposez votre fichier ici
//         </p>
//         <p className="text-slate-500 text-sm">ou cliquez pour sélectionner (PDF, JPG, PNG)</p>
//       </div>

//       {file && (
//         <div className="mt-6">
//           <div className="flex items-center bg-slate-100 p-3 rounded-lg">
//             <File className="w-8 h-8 text-blue-500" />
//             <div className="ml-3 flex-1">
//               <p className="text-sm font-medium text-slate-900">{file.name}</p>
//               <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
//             </div>
//             <p className="text-sm font-semibold">{progress}%</p>
//           </div>
//           <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
//             <div
//               className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// }










'use client'

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X, ArrowLeft, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
  const onDropCallback = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onDrop(acceptedFiles[0]);
    }
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] }, // On limite aux images pour l'instant
    maxFiles: 1,
    disabled: !!file // Désactive le drop si un fichier est déjà là
  });

  return (
    <div className="flex-1 w-full">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      
      {!file ? (
        <div
          {...getRootProps()}
          className={`h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors p-4 text-center
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
        >
          <input {...getInputProps()} />
          <UploadCloud className={`w-10 h-10 mb-3 ${isDragActive ? 'text-blue-500' : 'text-slate-400'}`} />
          <p className="text-sm font-medium text-slate-900">Cliquez ou glissez</p>
          <p className="text-xs text-slate-500 mt-1">JPG, PNG</p>
        </div>
      ) : (
        <div className="h-48 border border-slate-200 rounded-lg bg-white p-4 relative flex flex-col items-center justify-center shadow-sm">
          <button 
            onClick={onRemove}
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          
          <div className="bg-green-100 p-3 rounded-full mb-3">
            <FileIcon className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm font-medium text-slate-900 truncate max-w-[90%]">{file.name}</p>
          <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
          <div className="flex items-center text-green-600 mt-2 text-xs font-bold">
            <CheckCircle className="w-3 h-3 mr-1" /> Prêt
          </div>
        </div>
      )}
    </div>
  );
}

// --- Composant Principal ---
export function FileUploader({ 
  onUploadComplete, 
  onBack 
}: { 
  onUploadComplete: (recto: File, verso: File) => void; 
  onBack: () => void; 
}) {
  const [rectoFile, setRectoFile] = useState<File | null>(null);
  const [versoFile, setVersoFile] = useState<File | null>(null);

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
        Veuillez importer le recto et le verso de votre document.
      </p>

      {/* Grille pour les deux zones */}
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
          className={`w-full md:w-auto px-12 ${
            rectoFile && versoFile ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300'
          }`}
        >
          {rectoFile && versoFile ? "Lancer l'analyse" : "Importez les 2 faces"}
        </Button>
      </div>
    </motion.div>
  );
}
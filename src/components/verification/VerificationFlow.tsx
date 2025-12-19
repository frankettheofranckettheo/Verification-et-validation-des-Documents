'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUploader } from './FileUploader';
import { ScannerUI } from './ScannerUI'; // Nouveau composant
import { CameraCapture } from '@/components/camera/CameraCapture'; // Nouveau composant
import { AnalysisScreen } from './AnalysisScreen';
import { ResultsReport } from './ResultsReport';
import { VerificationMethod } from '@/app/verification/page';

// ... (gardez votre MOCK_RESULTS ici)
const MOCK_RESULTS = {
  isValid: true,
  confidence: 98.7,
  documentType: "Carte d'Identité",
  country: "Cameroun",
  extractedData: {
    'Nom': 'DUPONT',
    'Prénoms': 'JEAN-PIERRE',
    'Date de Naissance': '25/08/1985',
    'Numéro du Document': '1234567890',
  },
  securityChecks: [
    { name: 'Hologramme de Sécurité', status: 'pass' },
    { name: 'Micro-texte', status: 'pass' },
    { name: 'Concordance MRZ', status: 'pass' },
    { name: 'Vérification Photo', status: 'pass' },
  ],
};


export function VerificationFlow({ method, onBack }: { method: VerificationMethod, onBack: () => void }) {
  const [step, setStep] = useState<'capture' | 'analyzing' | 'results'>('capture');
  
  // États pour la méthode d'upload
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // États pour la méthode de scan
  const [rectoImage, setRectoImage] = useState<string | null>(null);
  const [versoImage, setVersoImage] = useState<string | null>(null);
  const [cameraSide, setCameraSide] = useState<'recto' | 'verso' | null>(null);

  const startAnalysis = () => {
    setStep('analyzing');
    setTimeout(() => {
      setStep('results');
    }, 4000);
  };
  
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    startAnalysis();
  };

  const handleImageCapture = (imageSrc: string) => {
    if (cameraSide === 'recto') setRectoImage(imageSrc);
    if (cameraSide === 'verso') setVersoImage(imageSrc);
    setCameraSide(null); // Ferme le modal de la caméra
  };

  const handleReset = () => {
    setUploadedFile(null);
    setRectoImage(null);
    setVersoImage(null);
    setStep('capture');
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 w-full">
      <AnimatePresence mode="wait">
        {step === 'capture' && (
          <motion.div key="capture" className="w-full max-w-2xl">
            {method === 'upload' && <FileUploader onFileUpload={handleFileUpload} onBack={onBack} />}
            {method === 'scan' && (
              <ScannerUI 
                rectoImage={rectoImage}
                versoImage={versoImage}
                onCaptureRecto={() => setCameraSide('recto')}
                onCaptureVerso={() => setCameraSide('verso')}
                onStartVerification={startAnalysis}
                onBack={onBack}
              />
            )}
          </motion.div>
        )}
        {step === 'analyzing' && (
          <motion.div key="analyzing" className="w-full max-w-xl">
            <AnalysisScreen file={uploadedFile} />
          </motion.div>
        )}
        {step === 'results' && (
          <motion.div key="results" className="w-full max-w-4xl">
            <ResultsReport results={MOCK_RESULTS} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Le modal de la caméra est rendu ici, au-dessus de tout le reste */}
      <AnimatePresence>
        {cameraSide && (
          <CameraCapture 
            documentSide={cameraSide}
            onCapture={handleImageCapture}
            onClose={() => setCameraSide(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
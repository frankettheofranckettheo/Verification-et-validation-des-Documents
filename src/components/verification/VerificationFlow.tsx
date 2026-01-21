// 'use client'

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FileUploader } from './FileUploader';
// import { ScannerUI } from './ScannerUI'; // Nouveau composant
// import { CameraCapture } from '@/components/camera/CameraCapture'; // Nouveau composant
// import { AnalysisScreen } from './AnalysisScreen';
// import { ResultsReport } from './ResultsReport';
// import { VerificationMethod } from '@/app/verification/page';

// // ... (gardez votre MOCK_RESULTS ici)
// const MOCK_RESULTS = {
//   isValid: true,
//   confidence: 98.7,
//   documentType: "Carte d'Identité",
//   country: "Cameroun",
//   extractedData: {
//     'Nom': 'DUPONT',
//     'Prénoms': 'JEAN-PIERRE',
//     'Date de Naissance': '25/08/1985',
//     'Numéro du Document': '1234567890',
//   },
//   securityChecks: [
//     { name: 'Hologramme de Sécurité', status: 'pass' },
//     { name: 'Micro-texte', status: 'pass' },
//     { name: 'Concordance MRZ', status: 'pass' },
//     { name: 'Vérification Photo', status: 'pass' },
//   ],
// };


// export function VerificationFlow({ method, onBack }: { method: VerificationMethod, onBack: () => void }) {
//   const [step, setStep] = useState<'capture' | 'analyzing' | 'results'>('capture');
  
//   // États pour la méthode d'upload
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);

//   // États pour la méthode de scan
//   const [rectoImage, setRectoImage] = useState<string | null>(null);
//   const [versoImage, setVersoImage] = useState<string | null>(null);
//   const [cameraSide, setCameraSide] = useState<'recto' | 'verso' | null>(null);

//   const startAnalysis = () => {
//     setStep('analyzing');
//     setTimeout(() => {
//       setStep('results');
//     }, 4000);
//   };
  
//   const handleFileUpload = (file: File) => {
//     setUploadedFile(file);
//     startAnalysis();
//   };

//   const handleImageCapture = (imageSrc: string) => {
//     if (cameraSide === 'recto') setRectoImage(imageSrc);
//     if (cameraSide === 'verso') setVersoImage(imageSrc);
//     setCameraSide(null); // Ferme le modal de la caméra
//   };

//   const handleReset = () => {
//     setUploadedFile(null);
//     setRectoImage(null);
//     setVersoImage(null);
//     setStep('capture');
//   };

//   return (
//     <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 w-full">
//       <AnimatePresence mode="wait">
//         {step === 'capture' && (
//           <motion.div key="capture" className="w-full max-w-2xl">
//             {method === 'upload' && <FileUploader onFileUpload={handleFileUpload} onBack={onBack} />}
//             {method === 'scan' && (
//               <ScannerUI 
//                 rectoImage={rectoImage}
//                 versoImage={versoImage}
//                 onCaptureRecto={() => setCameraSide('recto')}
//                 onCaptureVerso={() => setCameraSide('verso')}
//                 onStartVerification={startAnalysis}
//                 onBack={onBack}
//               />
//             )}
//           </motion.div>
//         )}
//         {step === 'analyzing' && (
//           <motion.div key="analyzing" className="w-full max-w-xl">
//             <AnalysisScreen file={uploadedFile} />
//           </motion.div>
//         )}
//         {step === 'results' && (
//           <motion.div key="results" className="w-full max-w-4xl">
//             <ResultsReport results={MOCK_RESULTS} onReset={handleReset} />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Le modal de la caméra est rendu ici, au-dessus de tout le reste */}
//       <AnimatePresence>
//         {cameraSide && (
//           <CameraCapture 
//             documentSide={cameraSide}
//             onCapture={handleImageCapture}
//             onClose={() => setCameraSide(null)}
//           />
//         )}
//       </AnimatePresence>
//     </main>
//   );
// }






// 'use client'

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FileUploader } from './FileUploader';
// import { ScannerUI } from './ScannerUI';
// import { CameraCapture } from '@/components/camera/CameraCapture';
// import { AnalysisScreen } from './AnalysisScreen';
// import { ResultsReport } from './ResultsReport';
// // Assurez-vous que le type VerificationMethod est bien importé ou défini
// // import { VerificationMethod } from '@/app/verification/page'; 
// type VerificationMethod = 'scan' | 'upload';

// // --- FONCTIONS UTILITAIRES ---

// // Convertir Base64 (Caméra) en Blob pour l'envoi API
// const dataURItoBlob = (dataURI: string) => {
//   try {
//     const byteString = atob(dataURI.split(',')[1]);
//     const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);
//     for (let i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }
//     return new Blob([ab], { type: mimeString });
//   } catch (e) {
//     console.error("Erreur conversion image", e);
//     return null;
//   }
// };

// // Fonction d'appel à l'API Python
// // const analyzeImageWithApi = async (file: File | Blob, side: string) => {
// //   const formData = new FormData();
// //   formData.append("file", file, `image_${side}.jpg`);

// //   try {
// //     const response = await fetch("http://localhost:8000/analyze", {
// //       method: "POST",
// //       body: formData,
// //     });
    
// //     if (!response.ok) throw new Error("Erreur API");
// //     return await response.json();
// //   } catch (error) {
// //     console.error("Erreur lors de l'analyse:", error);
// //     return null;
// //   }
// // };

// export function VerificationFlow({ method, onBack }: { method: VerificationMethod, onBack: () => void }) {
//   const [step, setStep] = useState<'capture' | 'analyzing' | 'results'>('capture');
  
//   // États
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [rectoImage, setRectoImage] = useState<string | null>(null);
//   const [versoImage, setVersoImage] = useState<string | null>(null);
//   const [cameraSide, setCameraSide] = useState<'recto' | 'verso' | null>(null);
  
//   // État pour stocker les résultats finaux
//   const [finalResults, setFinalResults] = useState<any>(null);

//   const startAnalysis = async () => {
//     setStep('analyzing');

//     try {
//       const formData = new FormData();

//       // CAS 1 : SCAN (Recto + Verso)
//       if (method === 'scan' && rectoImage) {
//         const blobRecto = dataURItoBlob(rectoImage);
//         if (blobRecto) formData.append("recto", blobRecto, "recto.jpg");
        
//         if (versoImage) {
//           const blobVerso = dataURItoBlob(versoImage);
//           if (blobVerso) formData.append("verso", blobVerso, "verso.jpg");
//         }
//       } 
//       // CAS 2 : UPLOAD (Fichier unique)
//       else if (method === 'upload' && uploadedFile) {
//         // Pour l'upload simple, on l'envoie comme recto par défaut
//         formData.append("recto", uploadedFile, uploadedFile.name);
//       } else {
//         throw new Error("Aucune image à analyser");
//       }

//       // Appel API vers le nouvel endpoint FULL
//       const response = await fetch("http://localhost:8000/analyze-full", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Erreur serveur API");
      
//       const data = await response.json();

//       // MAPPING DES DONNÉES (Python -> React)
//       // On formate les données pour qu'elles s'affichent bien dans ResultsReport
//       const mappedResults = {
//         isValid: data.is_valid_document,
//         confidence: data.confidence * 100,
//         documentType: data.document_type,
//         country: "Cameroun", // Ou détecté via OCR si implémenté
//         extractedData: {
//           'Type détecté': data.document_type,
//           'Expiration': data.validity.expiration_date,
//           'Détails validité': data.validity.details,
//           'Info Cohérence': data.coherence.message
//         },
//         securityChecks: [
//           { 
//             name: 'Cohérence Recto/Verso', 
//             status: data.coherence.status ? 'pass' : 'fail' 
//           },
//           { 
//             name: 'Détection IA', 
//             status: data.confidence > 0.5 ? 'pass' : 'warn' 
//           },
//           { 
//             name: 'Validité Temporelle', 
//             status: data.validity.status === 'VALIDE' ? 'pass' : 'fail' 
//           }
//         ],
//       };

//       setFinalResults(mappedResults);

//       // Délai pour l'UX
//       setTimeout(() => setStep('results'), 1000);

//     } catch (error) {
//       console.error(error);
//       alert("Erreur lors de l'analyse : " + error);
//       setStep('capture');
//     }
//   };

  
//   const handleFileUpload = (file: File) => {
//     setUploadedFile(file);
//     // On doit appeler startAnalysis, mais comme c'est async et dépend du state, 
//     // on l'appelle via un useEffect ou directement ici en passant le fichier si on refactorise.
//     // Pour simplifier, on set le state et on déclenche manuellement via un bouton ou effet.
//     // Ici, je force le step suivant et j'appelle la logique :
//     setUploadedFile(file);
//     setTimeout(() => startAnalysis(), 100); // Petit hack pour attendre le setUploadedFile
//   };

//   // Note: Pour FileUploader, il faudra modifier le composant pour qu'il appelle startAnalysis 
//   // ou qu'on déclenche l'analyse quand le fichier change. 
//   // Dans votre code original FileUploader appelait onFileUpload après un délai.

//   const handleImageCapture = (imageSrc: string) => {
//     if (cameraSide === 'recto') setRectoImage(imageSrc);
//     if (cameraSide === 'verso') setVersoImage(imageSrc);
//     setCameraSide(null);
//   };

//   const handleReset = () => {
//     setUploadedFile(null);
//     setRectoImage(null);
//     setVersoImage(null);
//     setFinalResults(null);
//     setStep('capture');
//   };

//   return (
//     <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 w-full">
//       <AnimatePresence mode="wait">
//         {step === 'capture' && (
//           <motion.div key="capture" className="w-full max-w-2xl">
//             {method === 'upload' && (
//                 // Modification ici : on passe directement une fonction qui set le file ET lance l'analyse
//                 <FileUploader 
//                     onFileUpload={(f) => { setUploadedFile(f); setTimeout(startAnalysis, 500); }} 
//                     onBack={onBack} 
//                 />
//             )}
//             {method === 'scan' && (
//               <ScannerUI 
//                 rectoImage={rectoImage}
//                 versoImage={versoImage}
//                 onCaptureRecto={() => setCameraSide('recto')}
//                 onCaptureVerso={() => setCameraSide('verso')}
//                 onStartVerification={startAnalysis}
//                 onBack={onBack}
//               />
//             )}
//           </motion.div>
//         )}
//         {step === 'analyzing' && (
//           <motion.div key="analyzing" className="w-full max-w-xl">
//             <AnalysisScreen file={uploadedFile} />
//           </motion.div>
//         )}
//         {step === 'results' && finalResults && (
//           <motion.div key="results" className="w-full max-w-4xl">
//             <ResultsReport results={finalResults} onReset={handleReset} />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {cameraSide && (
//           <CameraCapture 
//             documentSide={cameraSide}
//             onCapture={handleImageCapture}
//             onClose={() => setCameraSide(null)}
//           />
//         )}
//       </AnimatePresence>
//     </main>
//   );
// }









'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUploader } from './FileUploader';
import { ScannerUI } from './ScannerUI';
import { CameraCapture } from '@/components/camera/CameraCapture';
import { AnalysisScreen } from './AnalysisScreen';
import { ResultsReport } from './ResultsReport';
import { documentService } from '@/services/documentService';

// Assurez-vous que ce type est défini quelque part ou importé
type VerificationMethod = 'scan' | 'upload';

// Helper pour convertir Base64
const dataURItoBlob = (dataURI: string) => {
  try {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  } catch (e) {
    console.error(e);
    return null;
  }
};

export function VerificationFlow({ method, onBack }: { method: VerificationMethod, onBack: () => void }) {
  const [step, setStep] = useState<'capture' | 'analyzing' | 'results'>('capture');
  
  // États
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [rectoImage, setRectoImage] = useState<string | null>(null);
  const [versoImage, setVersoImage] = useState<string | null>(null);
  const [cameraSide, setCameraSide] = useState<'recto' | 'verso' | null>(null);
  const [finalResults, setFinalResults] = useState<any>(null);
  const [uploadedRecto, setUploadedRecto] = useState<File | null>(null);
  const [uploadedVerso, setUploadedVerso] = useState<File | null>(null);

  // Correction : La fonction accepte un fichier optionnel
  const startAnalysis = async (rectoDirect?: File, versoDirect?: File) => {
    setStep('analyzing');

    try {
      let rectoBlob: Blob | File | null = null;
      let versoBlob: Blob | File | null = null;

      // PRÉPARATION DES DONNÉES
      if (method === 'scan') {
        if (!rectoImage) throw new Error("Image recto manquante");
        rectoBlob = dataURItoBlob(rectoImage);
        
        if (versoImage) {
          versoBlob = dataURItoBlob(versoImage);
        }
      } 
      else if (method === 'upload') {
        // On prend soit les arguments directs, soit le state
        const r = rectoDirect || uploadedRecto;
        const v = versoDirect || uploadedVerso;

        if (!r || !v) throw new Error("Les deux fichiers (recto et verso) sont requis.");
        
        rectoBlob = r;
        versoBlob = v;

      }

      if (!rectoBlob) throw new Error("Erreur lors de la préparation des fichiers");


      // Appel API
      // const response = await fetch("http://localhost:8000/analyze-full", {
      //   method: "POST",
      //   body: formData,
      // });

      // if (!response.ok) {
      //   throw new Error("Erreur de communication avec l'API");
      // }
      
      // const data = await response.json();

      const data = await documentService.analyzeFull(rectoBlob, versoBlob);


      // Mapping des résultats API -> UI
      const mappedResults = {
        isValid: data.is_valid_document,
        confidence: data.confidence * 100,
        documentType: data.document_type,
        country: "Cameroun",
        extractedData: {
          'Document': data.document_type,
          'Cohérence': data.coherence.message,
          'Expiration': data.validity.expiration_date || 'Non lisible',
          'Info': data.validity.details
        },
        securityChecks: [
          { 
            name: 'Correspondance Recto/Verso', 
            status: data.coherence.status ? 'pass' : 'fail' 
          },
          { 
            name: 'Détection IA', 
            status: data.confidence > 0.5 ? 'pass' : 'warn' 
          },
          { 
            name: 'Validité Date', 
            status: data.validity.status === 'VALIDE' ? 'pass' : 'fail' 
          }
        ],
      };

      setFinalResults(mappedResults);

      // Petit délai pour l'UX
      setTimeout(() => {
        setStep('results');
      }, 1500);

    } catch (error: any) {
      console.error("Erreur Analyse:", error);
      // Axios renvoie les détails de l'erreur dans error.response?.data
      const message = error.response?.data?.detail || error.message || "Erreur inconnue";
      alert(`Échec de l'analyse : ${message}`);
      alert("Une erreur est survenue lors de l'analyse. Vérifiez que le backend tourne.");
      setStep('capture');
    }
  };

  // --- NOUVEAU HANDLE POUR L'UPLOAD ---
  const handleDualUpload = (recto: File, verso: File) => {
    setUploadedRecto(recto);
    setUploadedVerso(verso);
    // On déclenche l'analyse directement avec les fichiers
    startAnalysis(recto, verso);
  };

  const handleImageCapture = (imageSrc: string) => {
    if (cameraSide === 'recto') setRectoImage(imageSrc);
    if (cameraSide === 'verso') setVersoImage(imageSrc);
    setCameraSide(null);
  };

  const handleReset = () => {
    setUploadedFile(null);
    setRectoImage(null);
    setVersoImage(null);
    setFinalResults(null);
    setStep('capture');
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 w-full">
      <AnimatePresence mode="wait">
        {step === 'capture' && (
          <motion.div key="capture" className="w-full max-w-4xl">
            {method === 'upload' && (
              <FileUploader 
                onUploadComplete={handleDualUpload} 
                onBack={onBack} 
              />
            )}
            {method === 'scan' && (
              <ScannerUI 
                rectoImage={rectoImage}
                versoImage={versoImage}
                onCaptureRecto={() => setCameraSide('recto')}
                onCaptureVerso={() => setCameraSide('verso')}
                onStartVerification={() => startAnalysis()} 
                onBack={onBack}
              />
            )}
          </motion.div>
        )}
        
        {/* ... (Reste du code AnalysisScreen et ResultsReport identique) ... */}
        
        {step === 'analyzing' && (
            <motion.div key="analyzing" className="w-full max-w-xl">
                <AnalysisScreen file={uploadedFile} />
            </motion.div>
        )}
        {step === 'results' && finalResults && (
            <motion.div key="results" className="w-full max-w-4xl">
                <ResultsReport results={finalResults} onReset={handleReset} />
            </motion.div>
        )}

      </AnimatePresence>

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
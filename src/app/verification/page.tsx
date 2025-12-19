'use client'

import { useState } from 'react';
import { VerificationFlow } from '@/components/verification/VerificationFlow';
import { UploadCloud, ScanLine } from 'lucide-react';
import { motion } from 'framer-motion';

// --- TYPE DE LA MÉTHODE DE VÉRIFICATION ---
export type VerificationMethod = 'scan' | 'upload' | null;

export default function VerificationPage() {
  const [method, setMethod] = useState<VerificationMethod>(null);

  if (method) {
    return <VerificationFlow method={method} onBack={() => setMethod(null)} />;
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Vérification d'Identité Sécurisée
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Commencez par choisir une méthode pour soumettre votre document.
        </p>
        
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <MethodCard
            icon={ScanLine}
            title="Scanner le document"
            description="Utilisez votre caméra pour une capture en direct."
            onClick={() => setMethod('scan')}
          />
          <MethodCard
            icon={UploadCloud}
            title="Importer un fichier"
            description="Sélectionnez un document (PDF, JPG, PNG) depuis votre appareil."
            onClick={() => setMethod('upload')}
          />
        </div>
      </motion.div>
    </main>
  );
}

// --- CARTE DE SÉLECTION DE MÉTHODE ---
const MethodCard = ({ icon: Icon, title, description, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 300 }}
    onClick={onClick}
    className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-500 cursor-pointer text-center"
  >
    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="mt-5 text-xl font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 text-slate-500">{description}</p>
  </motion.div>
);

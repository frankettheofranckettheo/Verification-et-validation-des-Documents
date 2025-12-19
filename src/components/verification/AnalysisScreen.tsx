'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Cpu, CheckCircle } from 'lucide-react';

const analysisSteps = [
  { text: 'Lecture du document...', icon: FileText },
  { text: 'Vérification des points de sécurité...', icon: ShieldCheck },
  { text: 'Extraction des données par IA...', icon: Cpu },
];

export function AnalysisScreen({ file }: { file: File | null }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev < analysisSteps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-8 rounded-xl border border-slate-200 shadow-lg text-center"
    >
      <h2 className="text-2xl font-bold text-slate-900">Analyse en cours...</h2>
      <p className="text-slate-500 mt-2">Veuillez patienter, cela ne prendra que quelques instants.</p>
      
      <div className="relative w-24 h-24 mx-auto my-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border-4 border-slate-200 border-t-blue-600"
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="w-10 h-10 text-blue-500" />
        </div>
      </div>
      
      <div className="space-y-3">
        {analysisSteps.map((step, index) => (
          <div key={index} className="flex items-center text-left">
            <div className="w-6 h-6 flex-shrink-0">
              {currentStep > index ? (
                <CheckCircle className="text-green-500" />
              ) : currentStep === index ? (
                <div className="w-5 h-5 border-2 border-blue-500 rounded-full animate-pulse" />
              ) : (
                <div className="w-5 h-5 bg-slate-200 rounded-full" />
              )}
            </div>
            <span className={`ml-3 ${currentStep >= index ? 'text-slate-800' : 'text-slate-400'}`}>
              {step.text}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
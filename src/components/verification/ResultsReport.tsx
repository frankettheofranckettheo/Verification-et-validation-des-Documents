'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, CheckCircle, XCircle, RefreshCw, AlertTriangle, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

type Results = {
  isValid: boolean;
  confidence: number;
  documentType: string;
  country: string;
  extractedData: Record<string, string>;
  securityChecks: { name: string; status: 'pass' | 'fail' | 'warn' }[];
};

export function ResultsReport({ results, onReset }: { results: Results, onReset: () => void }) {
  const { isValid, confidence, documentType, country, extractedData, securityChecks } = results;

  // --- CORRECTION DU CALCUL ---
  // Si confidence <= 1 (ex: 0.98), on multiplie par 100.
  // Si confidence > 1 (ex: 98), on garde tel quel.
  const displayConfidence = confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence);

  // Couleur du texte selon le score
  let confidenceColor = "text-red-600";
  if (displayConfidence >= 80) confidenceColor = "text-green-600";
  else if (displayConfidence >= 50) confidenceColor = "text-orange-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-t-4 shadow-md" style={{ borderColor: isValid ? '#22c55e' : '#ef4444' }}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Rapport de Vérification</CardTitle>
              <p className="text-slate-500 font-medium">{documentType} - {country}</p>
            </div>
            <Badge className={`text-base px-4 py-2 ${isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isValid ? <ShieldCheck className="w-5 h-5 mr-2" /> : <ShieldAlert className="w-5 h-5 mr-2" />}
              {isValid ? 'Authentique' : 'Invalide'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          
          {/* Colonne de Gauche: Données */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-semibold text-slate-900 border-b pb-2">Données Extraites</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-lg bg-slate-50/50">
              {Object.entries(extractedData).map(([key, value]) => (
                <div key={key} className="text-sm border-b sm:border-b-0 sm:pb-0 pb-2 last:border-0 last:pb-0">
                  <p className="text-slate-500 uppercase text-xs font-bold tracking-wider">{key}</p>
                  <p className="font-medium text-slate-900 text-base break-words">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Colonne de Droite: Sécurité & Confiance */}
          <div className="space-y-6">
            
            {/* --- BLOC CONFIANCE SIMPLIFIÉ --- */}
            <div>
              <h3 className="font-semibold text-slate-900 border-b pb-2 mb-3">Score de Confiance IA</h3>
              <div className="p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-slate-600">Niveau de certitude du modèle</span>
                  <span className={`text-2xl font-bold ${confidenceColor}`}>
                      {displayConfidence}%
                  </span>
                </div>
              </div>
            </div>

            {/* Liste des contrôles */}
            <div>
              <h3 className="font-semibold text-slate-900 border-b pb-2 mb-3">Contrôles de Sécurité</h3>
              <div className="p-3 border rounded-lg bg-slate-50 space-y-3">
                {securityChecks.map((check, index) => (
                  <div key={index} className="flex items-start text-sm">
                    <div className="mt-0.5 mr-3 shrink-0">
                      {check.status === 'pass' && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {check.status === 'fail' && <XCircle className="w-5 h-5 text-red-500" />}
                      {check.status === 'warn' && <AlertTriangle className="w-5 h-5 text-orange-500" />}
                    </div>
                    <span className="text-slate-700 font-medium">{check.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button onClick={onReset} size="lg" className="shadow-lg hover:scale-105 transition-transform">
          <RefreshCw className="w-4 h-4 mr-2" />
          Vérifier un autre document
        </Button>
      </div>
    </motion.div>
  );
}
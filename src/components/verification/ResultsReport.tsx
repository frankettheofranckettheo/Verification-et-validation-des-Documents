'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Définition du type pour les résultats ---
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-t-4" style={{ borderColor: isValid ? '#22c55e' : '#ef4444' }}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Rapport de Vérification</CardTitle>
              <p className="text-slate-500">{documentType} - {country}</p>
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
            <h3 className="font-semibold text-slate-900">Données Extraites</h3>
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-slate-50">
              {Object.entries(extractedData).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <p className="text-slate-500">{key}</p>
                  <p className="font-medium text-slate-900">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Colonne de Droite: Sécurité */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Analyse de Sécurité</h3>
            <div className="p-4 border rounded-lg bg-slate-50 space-y-2">
              {securityChecks.map((check, index) => (
                <div key={index} className="flex items-center text-sm">
                  {check.status === 'pass' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  <span className="ml-2 text-slate-700">{check.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6 text-center">
        <Button onClick={onReset}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Vérifier un autre document
        </Button>
      </div>
    </motion.div>
  );
}
'use client'

import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ScannerUIProps {
  rectoImage: string | null;
  versoImage: string | null;
  onCaptureRecto: () => void;
  onCaptureVerso: () => void;
  onStartVerification: () => void;
  onBack: () => void;
}

export function ScannerUI({ rectoImage, versoImage, onCaptureRecto, onCaptureVerso, onStartVerification, onBack }: ScannerUIProps) {
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
    code Code

        
    <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Scan du Document</h2>
        <p className="text-slate-500 mt-2">Capturez le recto et le verso de votre document.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <CaptureSlot side="recto" image={rectoImage} onCapture={onCaptureRecto} />
        <CaptureSlot side="verso" image={versoImage} onCapture={onCaptureVerso} disabled={!rectoImage} />
      </div>

      {rectoImage && versoImage && (
        <div className="mt-8 text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={onStartVerification}>
            Lancer la Vérification
          </Button>
        </div>
      )}
    </motion.div>   

);
}

// 1. Définir les types des props
interface CaptureSlotProps {
  side: string;              // ex: "Recto" ou "Verso"
  image: string | null;      // L'URL de l'image ou null si pas encore prise
  onCapture: () => void;     // La fonction à appeler au clic
  disabled?: boolean;        // Optionnel (?) car il a une valeur par défaut
}

const CaptureSlot = ({ side, image, onCapture, disabled = false }: CaptureSlotProps) => (
<div className="flex flex-col items-center">
<div className="w-full aspect-[1.6/1] bg-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden">
{image ? (
<img src={image} alt={`Aperçu ${side}`} className="w-full h-full object-cover" />
) : (
<p className="text-slate-400">Aperçu {side}</p>
)}
</div>
<Button onClick={onCapture} disabled={disabled} className="mt-4">
{image ? <CheckCircle className="w-5 h-5 mr-2 text-green-400" /> : null}
{image ? `Reprendre le ${side}` : `Capturer le ${side}`}
</Button>
</div>
);
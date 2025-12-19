'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CameraCapture } from '@/components/camera/CameraCapture'
import { ImagePreview } from '@/components/camera/ImagePreview'
import { VerificationResults } from './VerificationResults'

export function DocumentScanner() {
  const [showCamera, setShowCamera] = useState<'recto' | 'verso' | null>(null)
  const [rectoImage, setRectoImage] = useState<string>('')
  const [versoImage, setVersoImage] = useState<string>('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleCapture = (imageSrc: string, side: 'recto' | 'verso') => {
    if (side === 'recto') {
      setRectoImage(imageSrc)
    } else {
      setVersoImage(imageSrc)
    }
    setShowCamera(null)
  }

  const handleRetake = (side: 'recto' | 'verso') => {
    if (side === 'recto') {
      setRectoImage('')
    } else {
      setVersoImage('')
    }
    setShowCamera(side)
  }

  const handleVerify = async () => {
    if (!rectoImage || !versoImage) {
      alert('Veuillez capturer le recto et le verso du document')
      return
    }

    setIsVerifying(true)
    
    // Simulation de la vérification
    setTimeout(() => {
      setResults({
        isValid: Math.random() > 0.3,
        confidence: Math.random() * 40 + 60, // 60-100%
        issues: Math.random() > 0.7 ? ['Qualité image faible', 'Reflets détectés'] : [],
        securityFeatures: [
          { name: 'Hologramme', present: true, valid: true },
          { name: 'Micro-texte', present: true, valid: Math.random() > 0.2 },
          { name: 'QR Code', present: true, valid: true },
          { name: 'UV', present: false, valid: false }
        ],
        extractedData: {
          type: 'cni',
          numero: '1234567890',
          nom: 'NDJIE',
          prenom: 'Jean',
          dateNaissance: '15/05/1985'
        }
      })
      setIsVerifying(false)
    }, 3000)
  }

  const resetScanner = () => {
    setRectoImage('')
    setVersoImage('')
    setResults(null)
  }

  if (results) {
    return (
      <VerificationResults 
        results={results} 
        onReset={resetScanner}
        rectoImage={rectoImage}
        versoImage={versoImage}
      />
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vérification de Document</CardTitle>
          <CardDescription>
            Capturez le recto et le verso de votre pièce d'identité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImagePreview
            rectoImage={rectoImage}
            versoImage={versoImage}
            onRetake={handleRetake}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button
              onClick={() => setShowCamera('recto')}
              variant={rectoImage ? "outline" : "default"}
              className="h-24 text-lg"
            >
              {rectoImage ? '✅ Recto Capturé' : '📷 Prendre le Recto'}
            </Button>
            <Button
              onClick={() => setShowCamera('verso')}
              variant={versoImage ? "outline" : "default"}
              className="h-24 text-lg"
            >
              {versoImage ? '✅ Verso Capturé' : '📷 Prendre le Verso'}
            </Button>
          </div>

          {rectoImage && versoImage && (
            <div className="text-center">
              <Button
                onClick={handleVerify}
                disabled={isVerifying}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Vérification en cours...
                  </>
                ) : (
                  '🔍 Vérifier le Document'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showCamera && (
        <CameraCapture
          onCapture={(imageSrc) => handleCapture(imageSrc, showCamera)}
          onClose={() => setShowCamera(null)}
          documentSide={showCamera}
        />
      )}
    </div>
  )
}
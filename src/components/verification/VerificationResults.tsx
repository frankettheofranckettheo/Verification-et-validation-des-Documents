'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VerificationResult } from '@/types/document'

interface VerificationResultsProps {
  results: VerificationResult
  onReset: () => void
  rectoImage: string
  versoImage: string
}

export function VerificationResults({ results, onReset, rectoImage, versoImage }: VerificationResultsProps) {
  const { isValid, confidence, issues, securityFeatures, extractedData } = results

  return (
    <div className="space-y-6">
      <Card className={isValid ? "border-green-200" : "border-red-200"}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                Résultat de la Vérification
              </CardTitle>
              <CardDescription>
                Analyse complète du document
              </CardDescription>
            </div>
            <Badge 
              variant={isValid ? "default" : "destructive"}
              className="text-lg px-4 py-2"
            >
              {isValid ? '✅ DOCUMENT VALIDE' : '❌ DOCUMENT INVALIDE'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{confidence.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Confiance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {securityFeatures.filter(f => f.valid).length}
              </div>
              <div className="text-sm text-gray-600">Sécurités Validées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{issues.length}</div>
              <div className="text-sm text-gray-600">Problèmes</div>
            </div>
          </div>

          {/* Données extraites */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Données Extraites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Numéro:</span> {extractedData.numero}
                </div>
                <div>
                  <span className="font-semibold">Nom:</span> {extractedData.nom}
                </div>
                <div>
                  <span className="font-semibold">Prénom:</span> {extractedData.prenom}
                </div>
                <div>
                  <span className="font-semibold">Date de naissance:</span> {extractedData.dateNaissance}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Éléments de sécurité */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Éléments de Sécurité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span>{feature.name}</span>
                    <Badge variant={feature.valid ? "default" : "destructive"}>
                      {feature.valid ? '✅' : '❌'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Problèmes détectés */}
          {issues.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Problèmes Détectés</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-red-600">
                  {issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4 justify-center mt-8">
            <Button onClick={onReset} variant="outline">
              🔄 Vérifier un autre document
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              📄 Générer un rapport
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
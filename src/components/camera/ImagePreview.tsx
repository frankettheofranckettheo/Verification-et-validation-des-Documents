'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ImagePreviewProps {
  rectoImage?: string
  versoImage?: string
  onRetake: (side: 'recto' | 'verso') => void
}

export function ImagePreview({ rectoImage, versoImage, onRetake }: ImagePreviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Recto</h3>
            {rectoImage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRetake('recto')}
              >
                Reprendre
              </Button>
            )}
          </div>
          {rectoImage ? (
            <img
              src={rectoImage}
              alt="Recto du document"
              className="w-full h-48 object-contain border rounded-lg"
            />
          ) : (
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Aucune image</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Verso</h3>
            {versoImage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRetake('verso')}
              >
                Reprendre
              </Button>
            )}
          </div>
          {versoImage ? (
            <img
              src={versoImage}
              alt="Verso du document"
              className="w-full h-48 object-contain border rounded-lg"
            />
          ) : (
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Aucune image</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
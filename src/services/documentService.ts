// src/services/documentService.ts
import apiClient from '@/lib/axios';

// Interface de réponse (basée sur votre backend Python)
export interface AnalyzeResponse {
  is_valid_document: boolean;
  document_type: string;
  confidence: number;
  coherence: {
    status: boolean;
    message: string;
  };
  validity: {
    status: string;
    expiration_date: string | null;
    details: string;
  };
}

export const documentService = {
  /**
   * Envoie les images au backend pour analyse complète
   */
  analyzeFull: async (recto: File | Blob, verso?: File | Blob | null) => {
    const formData = new FormData();
    
    // Ajout du recto
    // Si c'est un Blob (caméra), on lui donne un nom, sinon on garde le nom du fichier
    if (recto instanceof File) {
      formData.append('recto', recto);
    } else {
      formData.append('recto', recto, 'recto_capture.jpg');
    }

    // Ajout du verso (optionnel)
    if (verso) {
      if (verso instanceof File) {
        formData.append('verso', verso);
      } else {
        formData.append('verso', verso, 'verso_capture.jpg');
      }
    }

    // Appel Axios
    // Note: Axios détecte le FormData et met automatiquement le header 'multipart/form-data'
    const response = await apiClient.post<AnalyzeResponse>('/analyze-full', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }
};
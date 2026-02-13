// src/services/documentService.ts
import apiClient from '@/lib/axios';
import { prepareFileForBackend } from '@/utils/fileHelper'; // Assurez-vous d'avoir créé ce fichier

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
   * Convertit automatiquement les PDF en JPG si nécessaire.
   */
  analyzeFull: async (recto: File | Blob, verso?: File | Blob | null) => {
    
    // --- ÉTAPE 1 : Conversion des fichiers (PDF -> JPG) ---
    // On ne convertit que si c'est un objet File (pas un Blob brut de caméra)
    let processedRecto = recto;
    let processedVerso = verso;

    if (recto instanceof File) {
        processedRecto = await prepareFileForBackend(recto);
    }

    if (verso instanceof File) {
        processedVerso = await prepareFileForBackend(verso);
    }
    // -----------------------------------------------------

    const formData = new FormData();
    
    // Ajout du recto
    // Si c'est un Blob (caméra), on lui donne un nom, sinon on garde le nom du fichier converti
    if (processedRecto instanceof File) {
      // Axios utilisera le nom du fichier converti (ex: document.jpg)
      formData.append('recto', processedRecto);
    } else {
      // Cas du Blob (caméra)
      formData.append('recto', processedRecto, 'recto_capture.jpg');
    }

    // Ajout du verso (optionnel)
    if (processedVerso) {
      if (processedVerso instanceof File) {
        formData.append('verso', processedVerso);
      } else {
        formData.append('verso', processedVerso, 'verso_capture.jpg');
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
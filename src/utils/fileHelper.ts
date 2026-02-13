
// NOTE : On ne met PAS d'import 'pdfjs-dist' ici en haut !
// Cela ferait planter le build Next.js côté serveur.

/**
 * Prépare un fichier pour l'upload.
 * - Si c'est un PDF : convertit la 1ère page en image JPG.
 * - Si c'est une image : la renvoie telle quelle (PAS de conversion).
 */
export async function prepareFileForBackend(file: File): Promise<File> {
  
  // 1. Si on est côté serveur (build), on ne fait rien pour éviter le crash
  if (typeof window === 'undefined') {
    return file;
  }

  // 2. Si ce n'est PAS un PDF, on renvoie le fichier original
  if (file.type !== 'application/pdf') {
    return file; 
  }

  console.log(`Conversion du PDF ${file.name} en image pour le backend...`);

  try {
    // --- IMPORT DYNAMIQUE (C'est ici que la magie opère) ---
    // On charge la librairie seulement maintenant, dans le navigateur.
    const pdfjsLib = await import('pdfjs-dist');

    // Configuration du Worker (local)
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    // --- Logique de conversion ---
    const arrayBuffer = await file.arrayBuffer();
    
    // Note: pdfjsLib.getDocument est accessible via l'objet importé
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1); 

    // Echelle 2.5 pour une bonne qualité OCR
    const scale = 2.5; 
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error("Erreur contexte canvas");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      canvas: canvas,
      viewport: viewport
    }).promise;

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Conversion Canvas vers Blob échouée"));
          return;
        }
        
        // On remplace l'extension .pdf par .jpg
        const newFileName = file.name.replace(/\.pdf$/i, '') + '.jpg';
        const imageFile = new File([blob], newFileName, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });

        resolve(imageFile);
      }, 'image/jpeg', 0.95);
    });
  } catch (error) {
    console.error("Erreur lors de la conversion PDF -> Image :", error);
    // En cas d'erreur, on renvoie le fichier original pour ne pas bloquer l'utilisateur
    return file;
  }
}
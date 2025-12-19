export interface DocumentData {
    id: string;
    type: 'cni' | 'permis' | 'passeport';
    version: string;
    numero: string;
    nom: string;
    prenom: string;
    dateNaissance: string;
    lieuNaissance: string;
    dateDelivrance: string;
    dateExpiration: string;
    autorite: string;
    photo: string;
  }
  
  export interface VerificationResult {
    isValid: boolean;
    confidence: number;
    issues: string[];
    securityFeatures: SecurityFeature[];
    extractedData: DocumentData;
    timestamp: Date;
  }
  
  export interface SecurityFeature {
    name: string;
    present: boolean;
    valid: boolean;
    description: string;
  }
  
  export type DocumentType = 'cni' | 'permis' | 'passeport';
  export type DocumentVersion = '2005' | '2015' | '2023';
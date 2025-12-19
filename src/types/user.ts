export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin' | 'validator';
    organization?: string;
    createdAt: Date;
    lastLogin: Date;
  }
  
  export interface VerificationHistory {
    id: string;
    userId: string;
    documentType: string;
    documentNumber: string;
    result: boolean;
    confidence: number;
    timestamp: Date;
    imageUrl: string;
  }
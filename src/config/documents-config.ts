export const documentConfig = {
    cni: {
      versions: ['2005', '2015', '2023'],
      securityFeatures: {
        '2005': ['Hologramme basique', 'Micro-texte', 'Signature numérique'],
        '2015': ['Hologramme avancé', 'QR Code', 'Micro-texte', 'UV partiel'],
        '2023': ['Hologramme 3D', 'QR Code crypté', 'UV complet', 'NFC', 'Photo numérique']
      },
      dimensions: {
        width: 85.6,
        height: 53.98
      }
    },
    permis: {
      versions: ['2005', '2015', '2020'],
      securityFeatures: {
        '2005': ['Hologramme', 'Micro-texte', 'Signature'],
        '2015': ['Hologramme', 'QR Code', 'Micro-texte', 'Photo numérique'],
        '2020': ['Hologramme 3D', 'QR Code crypté', 'NFC', 'Données biométriques']
      },
      dimensions: {
        width: 85.6,
        height: 53.98
      }
    }
  }
  
  export const validationRules = {
    minConfidence: 70,
    requiredSecurityFeatures: {
      cni: ['hologram', 'microText'],
      permis: ['hologram', 'qrCode']
    },
    imageQuality: {
      minResolution: 300,
      maxBlur: 0.8,
      minBrightness: 40
    }
  }
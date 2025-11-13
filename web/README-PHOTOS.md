# Candidate Photos

This directory contains profile photos for all 20 presidential candidates for Costa Rica's 2026 elections.

## Photo Sources

All candidate photos were identified from La Nación's article on 2026 candidates. The images are protected by authentication, so they need to be downloaded manually.

### How to Download Photos

You can download photos from these sources:

1. **La Nación Article**: https://www.nacion.com/politica/estos-son-los-20-candidatos-a-presidente-de-costa/SZZYUPI55JB3ZHIZBCCYL4OYEI/story/
2. **Candidate Social Media** (Instagram, Facebook, official party websites)
3. **TSE Official Pages** (when available)

### File Naming Convention

Photos should be named using the party abbreviation in uppercase:
- `ACRM.jpg` - Ronny Castillo González (Aquí Costa Rica Manda)
- `CAC.jpg` - Claudia Dobles Camargo (Coalición Agenda Ciudadana)
- `CDS.jpg` - Ana Virginia Calzada Miranda (Centro Democrático y Social)
- `CR1.jpg` - Douglas Caamaño (Alianza Costa Rica Primero)
- `FA.jpg` - Ariel Robles (Frente Amplio)
- `PA.jpg` - José Aguilar Berrocal (Avanza)
- `PDLCT.jpg` - David Hernández (De la Clase Trabajadora)
- `PEL.jpg` - Marco Rodríguez Badilla (Esperanza y Libertad)
- `PEN.jpg` - Claudio Alpízar (Esperanza Nacional)
- `PIN.jpg` - Luis Amador (Integración Nacional)
- `PJSC.jpg` - Walter Hernández Juárez (Justicia Social Costarricense)
- `PLN.jpg` - Álvaro Ramos (Liberación Nacional)
- `PLP.jpg` - Eliécer Feinzaig (Liberal Progresista)
- `PNG.jpg` - Fernando Zamora (Nueva Generación)
- `PNR.jpg` - Fabricio Alvarado Muñoz (Nueva República)
- `PPSO.jpg` - Laura Fernández (Pueblo Soberano)
- `PSD.jpg` - Luz Mary Alpízar Loaiza (Progreso Social Democrático)
- `PUCD.jpg` - Boris Molina Acevedo (Unión Costarricense Democrática)
- `PUSC.jpg` - Juan Carlos Hidalgo (Unidad Social Cristiana)
- `UP.jpg` - Natalia Díaz (Unidos Podemos)

### Recommended Image Specifications

- Format: JPG or PNG
- Minimum resolution: 800x800 pixels
- Aspect ratio: Square (1:1) or portrait (3:4)
- File size: Under 500KB for web optimization

### After Adding Photos

After manually adding photo files to this directory, run the download script again to update `profiles.json`:

```bash
python3 scripts/download_candidate_photos.py
```

The script will detect existing photos and update the JSON file accordingly.

## Social Media Links

### Candidates with Public Profiles

- **Claudia Dobles (CAC)**: [Instagram @claudobles](https://www.instagram.com/claudobles/), [Facebook](https://www.facebook.com/ClaudiaDoblesC/)
- **Fabricio Alvarado (PNR)**: [Instagram @fabricio_alvarado](https://www.instagram.com/fabricio_alvarado/), [LinkedIn](https://www.linkedin.com/in/fabricioalvaradocr/)
- **José Aguilar Berrocal (PA)**: [Facebook](https://www.facebook.com/jose.a.berrocal/)

For other candidates, check their party's official websites or search their names on social media platforms.

import { getDestino, getEstilo } from '@/lib/options';
import type { EstiloId, OpcionesGeneracion } from '@/types';

export interface BuiltPrompt {
  prompt: string;
  extraReferenceUrl: string | null;
}

const CAMINITO_REFERENCE_URL = '/destinos/caminito-reference.jpg';

const STYLIZED_LABELS: Record<EstiloId, string> = {
  pixar: 'polished 3D animated',
  caricatura2d: '2D hand-drawn caricature',
  caricatura3d: 'semi-realistic 3D caricature',
  ghibli: 'hand-painted 2D anime',
};

export function buildPrompt(opciones: OpcionesGeneracion): BuiltPrompt {
  const destino = getDestino(opciones.destino);
  const estilo = getEstilo(opciones.estilo);
  const variante = destino.variantes.find((item) => item.id === opciones.variante);

  if (!variante) {
    throw new Error(`La variante ${opciones.variante} no pertenece a ${destino.id}.`);
  }

  const stylizedLabel = STYLIZED_LABELS[opciones.estilo];

  const lines = [
    `TASK: Transform the supplied reference selfie into a brand-new ${stylizedLabel} Argentine travel portrait. Treat the selfie as the single authoritative identity reference: keep the exact same person and anchor the artwork to their real face instead of redesigning, replacing or approximating it. Re-render the person and environment coherently in the selected illustrated style rather than applying a partial photo filter.`,
    `ART DIRECTION: ${estilo.en}.`,
    `IDENTITY — HIGHEST PRIORITY: The result must remain instantly recognizable as the same individual before satisfying style or destination details. Faithfully preserve their real facial proportions and asymmetries, eye color and shape, eyebrow shape, spacing between features, nose, mouth and smile, face shape, jawline, skin tone, hairline, hair color and hairstyle, facial hair, gender presentation, apparent age, ethnicity, glasses and distinguishing marks. Do not beautify, idealize, age, de-age or replace the face with a generic character face. Keep the full face sharp, clear and unobstructed.`,
    `WARDROBE: Dress the person as a contemporary traveler in tasteful, unbranded clothing appropriate for the selected destination, activity and weather.`,
    `SETTING: ${destino.en}.`,
    `SELECTED DESTINATION VARIANT: ${variante.en}. Render only this selected catalog variant; do not mix in props, animals, activities or landmarks from the destination's other variants. Integrate every element naturally with consistent perspective, scale, lighting and shadows.`,
    ...(variante.id === 'caminito'
      ? [
          `CAMINITO SCENE REFERENCE: The second supplied image is an authoritative visual reference for the setting only, never for the person's identity. Recreate the real Caminito in La Boca from its visual language: a narrow pedestrian cobblestone passage framed by tightly packed, tall corrugated-metal conventillo façades painted in saturated turquoise, yellow, red, blue and green; intricate wrought-iron balconies; street art and framed paintings; layered balconies and façades that create a dense, distinctly porteño streetscape. Do not substitute generic colorful suburban homes, detached houses, ordinary residential streets or simplified colorful buildings.`,
        ]
      : []),
    ...(destino.id === 'mendoza'
      ? [
          `MENDOZA PROP RESTRICTION: Do not add wine, wine glasses, tasting glasses, alcoholic bottles or any alcoholic drink. A traditional mate gourd is required only when the selected variant is mate-mendoza and is explicitly allowed because it is non-alcoholic; otherwise do not add beverages.`,
        ]
      : []),
    ...(destino.id === 'perito-moreno'
      ? [
          `PERITO MORENO RESTRICTION: Do not add any animals or birds to the scene, including condors, eagles, guanacos or Patagonian red foxes.`,
        ]
      : []),
    ...(variante.animal
      ? [
          `ANIMAL INTERACTION: Keep the animal's authentic species anatomy, proportions and natural movement while giving it the playful, camera-aware pose and friendly interaction described above. Keep the person's entire face visible. The animal remains an animal and does not wear human clothing.`,
        ]
      : []),
    `COMPOSITION: Create a vertical 9:16 travel portrait with the person as the clear focal point. Use the closest framing that still shows the selected regional element or interaction and its essential destination context. Keep the person's face large, detailed and easy to compare with the reference; prefer a front-facing or gentle three-quarter facial angle and avoid distant, profile or extreme-angle views. Use background depth to show the destination clearly without crowding the subject.`,
    `OUTPUT: Render every pixel, including the person, selected variant and destination, in the same ${stylizedLabel} style. Fill the full frame with scene content. Produce one finished image with no blank paper, white margins, vignette, captions, visible words, logos or commercial marks.`,
  ];

  return {
    prompt: lines.join(' '),
    extraReferenceUrl: variante.id === 'caminito' ? CAMINITO_REFERENCE_URL : null,
  };
}

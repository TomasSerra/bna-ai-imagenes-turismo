import {
  Brush,
  Building2,
  Clapperboard,
  Compass,
  Grape,
  Laugh,
  MapPinned,
  MountainSnow,
  Palmtree,
  Snowflake,
  Sparkles,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import type { DestinoId, EstiloId, VarianteId } from '@/types';

export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

export interface VarianteOption {
  id: VarianteId;
  en: string;
  animal?: true;
}

export interface DestinoOption {
  id: DestinoId;
  label: string;
  en: string;
  imageSrc: string;
  icon: IconComponent;
  variantes: readonly [VarianteOption, ...VarianteOption[]];
}

export interface EstiloOption {
  id: EstiloId;
  label: string;
  en: string;
  icon: IconComponent;
}

export const DESTINOS: readonly DestinoOption[] = [
  {
    id: 'cataratas',
    label: 'Cataratas del Iguazú',
    en: 'at the iconic Iguazú Falls in Misiones, Argentina, surrounded by lush subtropical rainforest, powerful cascades and fine mist catching warm sunlight; the waterfalls and jungle fill the entire frame',
    imageSrc: '/destinos/cataratas.jpg',
    icon: Palmtree,
    variantes: [
      {
        id: 'coati',
        en: "a friendly South American coati playfully poses beside the person, looks toward the camera and gently rests its front paws against the person's forearm",
        animal: true,
      },
      {
        id: 'tucan',
        en: 'a colorful toco toucan perches on a nearby branch at shoulder height, leans playfully toward the person and looks directly at the camera as if posing for the portrait',
        animal: true,
      },
      {
        id: 'mono-cai',
        en: "a playful black capuchin monkey, locally known as a mono caí, wraps one arm gently around the person's shoulder and looks toward the camera as a cheerful travel companion",
        animal: true,
      },
    ],
  },
  {
    id: 'perito-moreno',
    label: 'Glaciar Perito Moreno',
    en: 'at the Perito Moreno Glacier in Los Glaciares National Park, Argentina, with immense blue ice walls, fractured glacier textures, turquoise water and rugged Patagonian mountains filling the scene',
    imageSrc: '/destinos/glaciar.jpg',
    icon: Snowflake,
    variantes: [
      {
        id: 'condor',
        en: 'an Andean condor poses on a nearby rock with its wings partially spread and its head turned toward the camera',
        animal: true,
      },
      {
        id: 'guanaco',
        en: "a calm guanaco stands beside the person on a rocky overlook and bends its long neck toward the person's shoulder to join the portrait",
        animal: true,
      },
      {
        id: 'zorro-colorado',
        en: "a curious Patagonian red fox sits safely beside the person, tilts its head toward the camera and gently rests one front paw near the person's boot",
        animal: true,
      },
    ],
  },
  {
    id: 'buenos-aires',
    label: 'Buenos Aires',
    en: 'in Buenos Aires, Argentina, immersed in an unmistakable, lively porteño atmosphere with authentic urban architecture and warm travel-postcard lighting',
    imageSrc: '/destinos/buenos-aires.jpg',
    icon: Building2,
    variantes: [
      {
        id: 'obelisco',
        en: 'the person poses on Avenida 9 de Julio with the iconic white Obelisco clearly visible behind them, framed by the broad avenue, elegant city lights and golden-hour energy',
      },
      {
        id: 'caminito',
        en: 'the person poses on the pedestrian Caminito street in La Boca, surrounded by its vivid multicolored corrugated-metal façades, painted balconies and festive neighborhood character',
      },
    ],
  },
  {
    id: 'bariloche',
    label: 'Bariloche',
    en: 'in Bariloche, Argentina, surrounded by recognizable northern Patagonian mountain scenery under crisp natural light',
    imageSrc: '/destinos/bariloche.jpg',
    icon: MountainSnow,
    variantes: [
      {
        id: 'san-bernardo',
        en: "at a scenic overlook above deep blue Nahuel Huapi Lake, a friendly Saint Bernard sits close beside the person, looks proudly at the camera and rests one front paw gently against the person's arm",
        animal: true,
      },
      {
        id: 'snowboard',
        en: 'at the Cerro Catedral ski resort, the person poses with a clearly visible snowboard while wearing a warm beanie and ski goggles resting on the beanie above the forehead so both eyes remain visible; the mountain and ski runs are completely covered in abundant snow, with several secondary visitors actively skiing in the background',
      },
      {
        id: 'chocolate',
        en: 'the person holds an elegant open box of handcrafted Bariloche chocolates tilted naturally toward the camera, with an assortment of individual chocolates and bonbons clearly visible inside',
      },
    ],
  },
  {
    id: 'humahuaca',
    label: 'Quebrada de Humahuaca',
    en: 'in the Quebrada de Humahuaca in Jujuy, Argentina, surrounded by dramatic multicolored Andean hills, sunlit adobe textures and a clear high-altitude sky',
    imageSrc: '/destinos/quebrada.jpg',
    icon: Compass,
    variantes: [
      {
        id: 'llama',
        en: "a friendly decorated Andean llama stands beside the person, leans its face close to the person's cheek and looks directly at the camera to join the portrait",
        animal: true,
      },
      { id: 'cardones', en: 'a striking group of tall native cardón cacti framing the person' },
      { id: 'charango', en: 'the person is naturally holding a traditional Andean charango' },
    ],
  },
  {
    id: 'ushuaia',
    label: 'Ushuaia',
    en: 'at the end of the world near Ushuaia, Argentina, with the Beagle Channel, snow-capped mountains, windswept Fuegian coast and cold luminous southern light',
    imageSrc: '/destinos/ushuaia.jpg',
    icon: MapPinned,
    variantes: [
      {
        id: 'pinguino',
        en: 'a charming Magellanic penguin stands on the shore beside the person, looks toward the camera and raises one flipper in a playful wave',
        animal: true,
      },
      {
        id: 'lobo-marino',
        en: 'a South American sea lion poses naturally on a nearby coastal rock, looks toward the camera and lifts one front flipper in a playful greeting',
        animal: true,
      },
      { id: 'faro-les-eclaireurs', en: 'the red-and-white Les Éclaireurs Lighthouse clearly visible in the channel behind the person' },
    ],
  },
  {
    id: 'mendoza',
    label: 'Mendoza',
    en: 'in Mendoza, Argentina, with the sunlit Andes establishing a distinctive Cuyo travel setting and a warm, premium tourism-postcard atmosphere',
    imageSrc: '/destinos/mendoza.jpg',
    icon: Grape,
    variantes: [
      {
        id: 'vinedo',
        en: 'the person walks between orderly rows of healthy grapevines in a Mendoza vineyard and gently touches the leaves of one vine, with the Andes visible beyond the fields',
      },
      {
        id: 'bodega',
        en: 'the person visits an elegant working Mendoza winery, surrounded by authentic oak aging barrels and discreet winemaking equipment in a warm, atmospheric cellar',
      },
      {
        id: 'rafting',
        en: 'the person actively rides in a white-water raft on the Mendoza River near Potrerillos, wearing a secured helmet and life jacket, with splashing water and rugged Andean mountains around the raft',
      },
    ],
  },
] as const;

export const ESTILOS: readonly EstiloOption[] = [
  {
    id: 'pixar',
    label: 'Animación 3D',
    en: "polished modern 3D animated feature-film style — smooth sculpted forms, expressive eyes with bright catchlights, vibrant colors, soft cinematic lighting and a playful premium finish. Keep the person's real likeness clearly recognizable: preserve their actual eye color and shape, eyebrows, nose, mouth, hair, skin tone, facial hair and distinguishing marks. The entire scene is rendered in the same 3D animated style edge-to-edge",
    icon: Clapperboard,
  },
  {
    id: 'caricatura2d',
    label: 'Caricatura 2D',
    en: "hand-drawn 2D caricature by a professional editorial artist — a noticeably oversized head and small body, bold clean ink outlines, polished hand-colored shading, detailed hair and playful exaggeration while keeping the person's real likeness. The fully illustrated destination fills every corner with no blank paper, white margins or vignette",
    icon: Brush,
  },
  {
    id: 'caricatura3d',
    label: 'Caricatura 3D',
    en: "semi-realistic premium 3D caricature sculpt with strongly exaggerated proportions and detailed materials. The head is enormous relative to the narrow body; eyes are expressive, the real nose shape is playfully emphasized and the mouth remains compact. Preserve the person's identifiable features, hair, skin tone, facial hair and distinguishing marks. Render the entire destination in the same cinematic 3D style edge-to-edge",
    icon: Laugh,
  },
  {
    id: 'ghibli',
    label: 'Anime',
    en: "warm hand-painted 2D anime film style — soft watercolor environments, gentle colors, hand-drawn cel-shaded characters and clean line work. Keep the styling light enough that the person's true eye shape and color, nose, mouth, hair and facial structure remain clearly recognizable; do not replace them with a generic anime face or oversized eyes",
    icon: Sparkles,
  },
] as const;

export function getDestino(id: DestinoId): DestinoOption {
  const destino = DESTINOS.find((item) => item.id === id);
  if (!destino) throw new Error(`Destino desconocido: ${id}`);
  return destino;
}

export function getEstilo(id: EstiloId): EstiloOption {
  const estilo = ESTILOS.find((item) => item.id === id);
  if (!estilo) throw new Error(`Estilo desconocido: ${id}`);
  return estilo;
}

export function selectVariante(
  destinoId: DestinoId,
  random: () => number = Math.random,
): VarianteOption {
  const variantes = getDestino(destinoId).variantes;
  const sample = random();
  const normalized = Number.isFinite(sample) ? Math.min(Math.max(sample, 0), 0.999999999) : 0;
  return variantes[Math.floor(normalized * variantes.length)];
}

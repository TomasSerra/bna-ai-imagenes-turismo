export type EstiloId = 'ghibli' | 'pixar' | 'caricatura2d' | 'caricatura3d';

export type DestinoId =
  | 'cataratas'
  | 'perito-moreno'
  | 'buenos-aires'
  | 'bariloche'
  | 'humahuaca'
  | 'ushuaia'
  | 'mendoza'
  | 'cordoba';

export type VarianteId =
  | 'coati'
  | 'tucan'
  | 'mono-cai'
  | 'campera'
  | 'bufanda'
  | 'gorro-lana'
  | 'obelisco'
  | 'caminito'
  | 'san-bernardo'
  | 'snowboard'
  | 'chocolate'
  | 'llama'
  | 'cardones'
  | 'charango'
  | 'pinguino'
  | 'lobo-marino'
  | 'faro-les-eclaireurs'
  | 'racimo-uvas'
  | 'aceituna'
  | 'mate-mendoza'
  | 'mate-cordoba'
  | 'salame-cordobes'
  | 'queso-cordobes'
  | 'alfajores-cordobeses';

export interface Opciones {
  destino: DestinoId;
  estilo: EstiloId;
}

export interface OpcionesGeneracion extends Opciones {
  variante: VarianteId;
}

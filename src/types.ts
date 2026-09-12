export type EstiloId = 'ghibli' | 'pixar' | 'caricatura2d' | 'caricatura3d';

export type DestinoId =
  | 'cataratas'
  | 'perito-moreno'
  | 'buenos-aires'
  | 'bariloche'
  | 'humahuaca'
  | 'ushuaia'
  | 'mendoza';

export type VarianteId =
  | 'coati'
  | 'tucan'
  | 'mono-cai'
  | 'condor'
  | 'guanaco'
  | 'zorro-colorado'
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
  | 'vinedo'
  | 'bodega'
  | 'rafting';

export interface Opciones {
  destino: DestinoId;
  estilo: EstiloId;
}

export interface OpcionesGeneracion extends Opciones {
  variante: VarianteId;
}

import { describe, expect, it } from 'vitest';
import { DESTINOS, ESTILOS, getDestino, selectVariante } from '@/lib/options';
import { buildPrompt } from '@/lib/prompt';

const EXPECTED_ANIMAL_VARIANTS = [
  'coati',
  'tucan',
  'mono-cai',
  'san-bernardo',
  'llama',
  'pinguino',
  'lobo-marino',
] as const;

describe('catálogo turístico', () => {
  it('define ocho destinos y veinticuatro variantes globalmente únicas', () => {
    expect(DESTINOS).toHaveLength(8);
    expect(new Set(DESTINOS.map((destino) => destino.id)).size).toBe(8);
    expect(DESTINOS.every((destino) => destino.imageSrc.endsWith('.webp'))).toBe(true);

    const variantIds = DESTINOS.flatMap((destino) => {
      expect(destino.variantes.length).toBeGreaterThan(0);
      expect(new Set(destino.variantes.map((variante) => variante.id)).size).toBe(
        destino.variantes.length,
      );
      return destino.variantes.map((variante) => variante.id);
    });

    expect(variantIds).toHaveLength(24);
    expect(new Set(variantIds).size).toBe(24);
  });

  it('ofrece dos variantes para Buenos Aires, cuatro para Córdoba y tres para los demás', () => {
    for (const destino of DESTINOS) {
      const expectedLength = destino.id === 'buenos-aires' ? 2 : destino.id === 'cordoba' ? 4 : 3;
      expect(destino.variantes).toHaveLength(expectedLength);
    }
  });

  it.each(DESTINOS)('selecciona únicamente variantes de $label', (destino) => {
    expect(selectVariante(destino.id, () => -1)).toBe(destino.variantes[0]);
    expect(selectVariante(destino.id, () => 0)).toBe(destino.variantes[0]);
    expect(selectVariante(destino.id, () => 0.99)).toBe(destino.variantes.at(-1));
    expect(selectVariante(destino.id, () => 1)).toBe(destino.variantes.at(-1));
    expect(selectVariante(destino.id, () => Number.NaN)).toBe(destino.variantes[0]);
  });

  it('distribuye las dos variantes de Buenos Aires en mitades iguales', () => {
    const buenosAires = getDestino('buenos-aires');

    expect(selectVariante('buenos-aires', () => 0.499999)).toBe(buenosAires.variantes[0]);
    expect(selectVariante('buenos-aires', () => 0.5)).toBe(buenosAires.variantes[1]);
  });

  it('incluye las escenas nuevas y elimina las opciones reemplazadas', () => {
    const buenosAires = getDestino('buenos-aires');
    const cataratas = getDestino('cataratas');
    const bariloche = getDestino('bariloche');
    const glaciar = getDestino('perito-moreno');
    const mendoza = getDestino('mendoza');
    const cordoba = getDestino('cordoba');
    const allVariantIds = DESTINOS.flatMap((destino) =>
      destino.variantes.map((variante) => variante.id),
    );

    expect(buenosAires.label).toBe('Buenos Aires');
    expect(buenosAires.variantes.map((variante) => variante.id)).toEqual([
      'obelisco',
      'caminito',
    ]);
    expect(cataratas.variantes.map((variante) => variante.id)).toEqual([
      'coati',
      'tucan',
      'mono-cai',
    ]);
    expect(bariloche.variantes.map((variante) => variante.id)).toEqual([
      'san-bernardo',
      'snowboard',
      'chocolate',
    ]);
    expect(mendoza.variantes.map((variante) => variante.id)).toEqual([
      'racimo-uvas',
      'aceituna',
      'mate-mendoza',
    ]);
    expect(glaciar.variantes.map((variante) => variante.id)).toEqual([
      'campera',
      'bufanda',
      'gorro-lana',
    ]);
    expect(cordoba.variantes.map((variante) => variante.id)).toEqual([
      'mate-cordoba',
      'salame-cordobes',
      'queso-cordobes',
      'alfajores-cordobeses',
    ]);
    expect(allVariantIds).not.toEqual(
      expect.arrayContaining([
        'condor',
        'guanaco',
        'zorro-colorado',
        'vinedo',
        'bodega',
        'rafting',
      ]),
    );
  });

  it('marca exactamente las siete variantes con animales', () => {
    const animalIds = DESTINOS.flatMap((destino) =>
      destino.variantes.filter((variante) => variante.animal).map((variante) => variante.id),
    );

    expect(animalIds).toEqual(EXPECTED_ANIMAL_VARIANTS);
  });
});

describe('prompt turístico', () => {
  it('construye las 96 combinaciones variante/estilo', () => {
    let combinations = 0;

    for (const destino of DESTINOS) {
      for (const variante of destino.variantes) {
        for (const estilo of ESTILOS) {
          const { prompt, extraReferenceUrl } = buildPrompt({
            destino: destino.id,
            estilo: estilo.id,
            variante: variante.id,
          });

          expect(prompt).toContain(destino.en);
          expect(prompt).toContain(estilo.en);
          expect(prompt).toContain(variante.en);
          expect(prompt).toContain('Render only this selected catalog variant');
          expect(prompt).not.toContain('exactly one regional surprise');
          expect(extraReferenceUrl).toBe(variante.id === 'caminito' ? '/destinos/caminito-reference.jpg' : null);
          combinations += 1;
        }
      }
    }

    expect(combinations).toBe(96);
  });

  it('agrega reglas de pose divertida y anatomía natural a todos los animales', () => {
    for (const destino of DESTINOS) {
      for (const variante of destino.variantes.filter((item) => item.animal)) {
        const { prompt } = buildPrompt({
          destino: destino.id,
          estilo: 'pixar',
          variante: variante.id,
        });

        expect(prompt).toContain('ANIMAL INTERACTION');
        expect(prompt).toContain("animal's authentic species anatomy");
        expect(prompt).toContain('playful, camera-aware pose');
        expect(prompt).toContain('does not wear human clothing');
        expect(prompt).toContain('Keep the full face sharp, clear and unobstructed');
      }
    }
  });

  it('describe todos los requisitos visuales de Bariloche', () => {
    const snowboardPrompt = buildPrompt({
      destino: 'bariloche',
      estilo: 'pixar',
      variante: 'snowboard',
    }).prompt;
    const chocolatePrompt = buildPrompt({
      destino: 'bariloche',
      estilo: 'pixar',
      variante: 'chocolate',
    }).prompt;

    expect(snowboardPrompt).toMatch(/Cerro Catedral/);
    expect(snowboardPrompt).toMatch(/snowboard/);
    expect(snowboardPrompt).toMatch(/beanie/);
    expect(snowboardPrompt).toMatch(/ski goggles/);
    expect(snowboardPrompt).toMatch(/both eyes remain visible/);
    expect(snowboardPrompt).toMatch(/completely covered in abundant snow/);
    expect(snowboardPrompt).toMatch(/visitors actively skiing in the background/);
    expect(chocolatePrompt).toMatch(/open box/);
    expect(chocolatePrompt).toMatch(/tilted naturally toward the camera/);
    expect(chocolatePrompt).toMatch(/chocolates and bonbons clearly visible/);
  });

  it('describe las escenas porteñas y los nuevos paisajes y elementos regionales', () => {
    const buenosAires = getDestino('buenos-aires');
    const glaciar = getDestino('perito-moreno');
    const mendoza = getDestino('mendoza');
    const cordoba = getDestino('cordoba');

    expect(buenosAires.variantes[0].en).toMatch(/Avenida 9 de Julio.*Obelisco/);
    expect(buenosAires.variantes[1].en).toMatch(/Caminito.*La Boca.*multicolored/);
    expect(glaciar.en).toMatch(/mini-trekking.*Perito Moreno Glacier/);
    expect(glaciar.variantes.map((item) => item.en).join(' ')).toMatch(/jacket.*scarf.*wool beanie/);
    expect(mendoza.en).toMatch(/Andes.*vineyards.*olive groves/);
    expect(mendoza.variantes.map((item) => item.en).join(' ')).toMatch(/grapes.*olives.*mate/);
    expect(cordoba.en).toMatch(/sierras.*Villa Carlos Paz.*rivers.*waterfall/);
    expect(cordoba.variantes.map((item) => item.en).join(' ')).toMatch(
      /mate.*salami.*cheese.*alfajores/,
    );
  });

  it('usa la foto del Caminito como referencia exclusiva del escenario', () => {
    const { prompt, extraReferenceUrl } = buildPrompt({
      destino: 'buenos-aires',
      estilo: 'pixar',
      variante: 'caminito',
    });

    expect(extraReferenceUrl).toBe('/destinos/caminito-reference.jpg');
    expect(prompt).toContain('CAMINITO SCENE REFERENCE');
    expect(prompt).toContain('second supplied image');
    expect(prompt).toContain('corrugated-metal conventillo façades');
    expect(prompt).toContain('generic colorful suburban homes');
  });

  it('prioriza la identidad facial, elimina animales del Glaciar y alcohol de Mendoza', () => {
    const mendozaPrompt = buildPrompt({
      destino: 'mendoza',
      estilo: 'pixar',
      variante: 'mate-mendoza',
    }).prompt;
    const glaciarPrompt = buildPrompt({
      destino: 'perito-moreno',
      estilo: 'pixar',
      variante: 'campera',
    }).prompt;
    const cataratasPrompt = buildPrompt({
      destino: 'cataratas',
      estilo: 'pixar',
      variante: 'coati',
    }).prompt;

    expect(mendozaPrompt).toContain('single authoritative identity reference');
    expect(mendozaPrompt).toContain('IDENTITY — HIGHEST PRIORITY');
    expect(mendozaPrompt).toContain('Do not beautify, idealize, age, de-age');
    expect(mendozaPrompt).toContain('Keep the person\'s face large, detailed');
    expect(mendozaPrompt).toContain('Do not add wine');
    expect(mendozaPrompt).toContain('mate gourd is required');
    expect(mendozaPrompt).not.toMatch(/white-water raft|Mendoza River near Potrerillos/);
    expect(glaciarPrompt).toContain('Do not add any animals or birds');
    expect(glaciarPrompt).toContain('condors, eagles, guanacos or Patagonian red foxes');
    expect(cataratasPrompt).not.toContain('MENDOZA PROP RESTRICTION');
  });

  it('rechaza una variante que no pertenece al destino', () => {
    expect(() =>
      buildPrompt({ destino: 'cataratas', estilo: 'pixar', variante: 'campera' }),
    ).toThrow('no pertenece');
  });
});

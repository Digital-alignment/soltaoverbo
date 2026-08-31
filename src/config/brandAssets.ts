/**
 * Diccionario centralizado de assets de marca para Solta o Verbo.
 * Sincronizado desde el Manual Vivo de Identidad Visual (soltavdesign).
 */

export const BRAND_ASSETS = {
  logos: {
    // Logotipos Master Horizontales
    horizontal: '/brand-assets/logos/master/logo-master-azul.svg',
    horizontalCarvao: '/brand-assets/logos/master/logo-master-carvao.svg',
    horizontalTerracota: '/brand-assets/logos/master/logo-master-terracota.svg',
    horizontalNegativo: '/brand-assets/logos/master/logo-master-negativo.svg',

    // Logotipos Master Verticales
    vertical: '/brand-assets/logos/master/logo-master-vertical-azul.svg',
    verticalBlanco: '/brand-assets/logos/master/logo-master-vertical-blanco.svg',
    verticalTerracota: '/brand-assets/logos/master/logo-master-vertical-terracota.svg',
    verticalLemon: '/brand-assets/logos/master/logo-master-vertical-lemon.svg',

    // Monogramas / Isotipos 'sv'
    icon: '/brand-assets/logos/monogram/monograma-sv-azul.svg',
    iconTerracota: '/brand-assets/logos/monogram/monograma-sv-terracota.svg',
    iconLemon: '/brand-assets/logos/monogram/monograma-sv-lemon.svg',
    iconWhite: '/brand-assets/logos/monogram/monograma-sv-white.svg',
    iconCarbon: '/brand-assets/logos/monogram/monograma-sv-carbon.svg',

    // Watermarks
    footerWatermark: '/brand-assets/logos/master/logo-master-azul.svg',

    // Fallbacks PNG de raíz
    horizontalPng: '/logo_horizontal_4.png',
    footerWatermarkPng: '/logo_footer_soltaoverbo.png',
    iconPng: '/icone_37.png',
  },
  fonts: {
    editorial: {
      regular: '/brand-assets/fuentes/PP Editorial (logo)/PPEditorialNew-Regular.otf',
      italic: '/brand-assets/fuentes/PP Editorial (logo)/PPEditorialNew-Italic.otf',
      ultrabold: '/brand-assets/fuentes/PP Editorial (logo)/PPEditorialNew-Ultrabold.otf',
      ultraboldItalic: '/brand-assets/fuentes/PP Editorial (logo)/PPEditorialNew-UltraboldItalic.otf',
      ultralight: '/brand-assets/fuentes/PP Editorial (logo)/PPEditorialNew-Ultralight.otf',
    },
    gesto: {
      otf: '/brand-assets/fuentes/Muthaze (escrita)/Muthazle.otf',
      ttf: '/brand-assets/fuentes/Muthaze (escrita)/Muthazle.ttf',
    },
  },
  graphics: {
    elementsDir: '/brand-assets/elements/',
    texturesDir: '/brand-assets/textures/',
    iconsDir: '/brand-assets/icons/',
    galleryDir: '/brand-assets/gallery/',
  },
} as const;

export type BrandAssets = typeof BRAND_ASSETS;

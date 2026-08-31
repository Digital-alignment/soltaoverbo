/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Tokens de Design Oficiales (soltavdesign)
        bgPlataforma: '#EDE6D4',   // Papel Semente (fundo base da plataforma)
        papelClaro: '#F7F3E8',     // Papel Claro (polaroid & fundo de cards)
        acentoAzul: '#140D82',     // Azul Profundo Elétrico (títulos/marca/links)
        acentoTerracota: '#FD5E32',// Terracota / Chama Viva (botões/badges/fogo)
        acentoOliva: '#BEC540',    // Oliva / Chartreuse (destaques/badges)
        tintaCarvao: '#2C2720',    // Carvão / Nanquim (corpo de texto)
        papelKraft: '#DFD6BF',     // Papel Kraft (hairlines 1px & washi tape)

        // Mapeamento de Colores Legado (compatibilidad total)
        paper: '#EDE6D4',
        deepBlue: '#140D82',
        limeGreen: '#BEC540',
        actionOrange: '#FD5E32',
        darkNeutral: '#2C2720',
        footerPurple: '#190087',
        popupCream: '#F7F3E8',
        popupText: '#140D82',
        iconGreen: '#BEC540',
      },
      fontFamily: {
        // Familias Tipográficas Oficiales (soltavdesign)
        editorial: ['var(--font-editorial)', 'var(--font-heading)', 'serif'],
        corpo: ['var(--font-corpo)', 'var(--font-body)', 'sans-serif'],
        gesto: ['var(--font-gesto)', 'var(--font-accent)', 'cursive'],
        typewriter: ['var(--font-typewriter)', 'Courier', 'monospace'],

        // Aliases heredados para compatibilidad
        heading: ['var(--font-editorial)', 'var(--font-heading)', 'serif'],
        body: ['var(--font-corpo)', 'var(--font-body)', 'sans-serif'],
        accent: ['var(--font-gesto)', 'var(--font-accent)', 'cursive'],
        sans: ['var(--font-corpo)', 'var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'kraft': '0 2px 8px -2px rgba(44, 39, 32, 0.08)',
        'kraft-lg': '0 10px 30px -5px rgba(44, 39, 32, 0.12)',
      },
    },
  },
  plugins: [],
};

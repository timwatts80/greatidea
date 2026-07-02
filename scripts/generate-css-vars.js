/**
 * Script to generate CSS variables from tokens.ts
 * Run with: node scripts/generate-css-vars.js
 */

const { writeFileSync } = require('fs');

// Import tokens manually since we're using CommonJS
const tokens = {
  colors: {
    primary: {
      50: '#fffbf0',
      100: '#fff5d6',
      200: '#ffebad',
      300: '#ffdc7a',
      400: '#ffc946',
      500: '#FFAE00',
      600: '#e69900',
      700: '#cc8500',
      800: '#b37000',
      900: '#995c00',
    },
    secondary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    neutral: {
      white: '#ffffff',
      black: '#000000',
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      }
    }
  },
  typography: {
    fontFamily: {
      primary: 'var(--font-poppins), system-ui, -apple-system, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
    '5xl': '8rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  transitions: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
  }
};

const generateCSSVariables = () => {
  const cssVars = {};
  
  // Colors
  Object.entries(tokens.colors.primary).forEach(([key, value]) => {
    cssVars[`--color-primary-${key}`] = value;
  });
  
  Object.entries(tokens.colors.secondary).forEach(([key, value]) => {
    cssVars[`--color-secondary-${key}`] = value;
  });
  
  Object.entries(tokens.colors.neutral.gray).forEach(([key, value]) => {
    cssVars[`--color-gray-${key}`] = value;
  });
  
  // Add individual neutral colors
  cssVars['--color-white'] = tokens.colors.neutral.white;
  cssVars['--color-black'] = tokens.colors.neutral.black;
  
  // Main color aliases
  cssVars['--color-primary'] = tokens.colors.primary[500];
  cssVars['--color-secondary'] = tokens.colors.secondary[500];
  cssVars['--color-background'] = tokens.colors.neutral.white;
  cssVars['--color-foreground'] = tokens.colors.neutral.gray[900];
  
  // Typography
  Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
    cssVars[`--font-size-${key}`] = value;
  });
  
  Object.entries(tokens.typography.fontWeight).forEach(([key, value]) => {
    cssVars[`--font-weight-${key}`] = value;
  });
  
  cssVars['--font-family-primary'] = tokens.typography.fontFamily.primary;
  
  // Spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value;
  });
  
  // Border Radius
  Object.entries(tokens.borderRadius).forEach(([key, value]) => {
    cssVars[`--border-radius-${key}`] = value;
  });
  
  // Shadows
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    cssVars[`--shadow-${key}`] = value;
  });
  
  // Transitions
  Object.entries(tokens.transitions).forEach(([key, value]) => {
    cssVars[`--transition-${key}`] = value;
  });
  
  return cssVars;
};

const cssVars = generateCSSVariables();

// Generate CSS content
const cssContent = `@import "tailwindcss";

:root {
${Object.entries(cssVars)
  .map(([key, value]) => `  ${key}: ${value};`)
  .join('\n')}

  /* Define theme colors for Tailwind */
  --color-primary: var(--color-primary-500);
  --color-secondary: var(--color-secondary-500);
}

/* Custom component styles using design tokens */
.btn-primary {
    padding: 1rem 2rem;
    border-radius: var(--border-radius-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-foreground);
    background-color: var(--color-primary);
    transition: all var(--transition-normal);
    border: none;
    cursor: pointer;
  }

  .btn-primary:hover {
    transform: scale(1.05);
  }

  .btn-secondary {
    padding: 1rem 2rem;
    border-radius: var(--border-radius-lg);
    font-weight: var(--font-weight-semibold);
    color: white;
    background-color: var(--color-secondary);
    transition: all var(--transition-normal);
    border: none;
    cursor: pointer;
  }

  .btn-secondary:hover {
    transform: scale(1.05);
  }

  .btn-outline {
    padding: 1rem 2rem;
    border-radius: var(--border-radius-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-primary);
    background-color: transparent;
    border: 2px solid var(--color-primary);
    transition: all var(--transition-normal);
    cursor: pointer;
  }

  .btn-outline:hover {
    background-color: var(--color-primary);
    color: var(--color-foreground);
    transform: scale(1.05);
  }

  .card {
    padding: 2rem;
    border-radius: var(--border-radius-xl);
    background-color: var(--color-white);
    box-shadow: var(--shadow-md);
    transition: all 300ms ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .section-padding {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }

  @media (min-width: 768px) {
    .section-padding {
      padding-top: 5rem;
      padding-bottom: 5rem;
    }
  }

  @media (min-width: 1024px) {
    .section-padding {
      padding-top: 6rem;
      padding-bottom: 6rem;
    }
  }

  .container-padding {
    max-width: 80rem;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  @media (min-width: 640px) {
    .container-padding {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    .container-padding {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }

  .text-gradient {
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .bg-gradient-primary {
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  }

  .bg-gradient-secondary {
    background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
  }

/* Global styles */
html {
  font-family: var(--font-family-primary);
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
}
`;

// Write to globals.css
writeFileSync('./src/app/globals.css', cssContent);
console.log('✅ CSS variables generated from tokens and written to globals.css');
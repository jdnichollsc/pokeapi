const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

const uiTailwindConfig = require('../../libs/ui/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [uiTailwindConfig],
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
};

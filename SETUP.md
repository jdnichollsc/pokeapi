# Setup Instructions

## Commands used to create the project structure

```sh
npx create-nx-workspace@latest todo-angular
npx nx g @nx/angular:library libs/ui --publishable --import-path=@pokeapi/ui
npx nx add @nx/storybook
npx nx g storybook-configuration --project=ui

npx nx g @nx/angular:setup-tailwind ui
npx nx g @nx/angular:setup-tailwind web
```

- Add daisyui and other tailwindcss dependencies:
```sh
npm add -D @tailwindcss/aspect-ratio @tailwindcss/forms @tailwindcss/line-clamp @tailwindcss/typography daisyui@latest
npm add -D postcss autoprefixer postcss-import postcss-preset-env
```

- Create new UI components:
```sh
npx nx g @nx/angular:component --name=item\
 --path=libs/ui/src/lib/item/item
npx nx g @nx/angular:component --name=form\
 --path=libs/ui/src/lib/forms/form/form
npx nx g @nx/angular:component --name=search\
 --path=libs/ui/src/lib/inputs/search/search
```

- Add library for state management
```sh
npx nx g @nx/angular:library libs/state --publishable --import-path=@pokeapi/state
npm add @ngrx/store @ngrx/effects @ngrx/signals @ngrx/store-devtools
```

- Add library for shared settings
```sh
npx nx g @nx/angular:library libs/shared --buildable --import-path=@pokeapi/shared
npm add -D @ngx-env/builder
```

- Add utilities
```sh
npm add date-fns
```
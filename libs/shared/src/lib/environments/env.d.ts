/// <reference types="@ngx-env/builder" />

interface ImportMetaEnv {
  readonly NG_APP_ENV: string;
  readonly NODE_ENV: 'development' | 'production' | 'test';
  [key: string]: unknown;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

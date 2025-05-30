/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly STORYBLOK_ACCESS_TOKEN: string;
  readonly PUBLIC_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

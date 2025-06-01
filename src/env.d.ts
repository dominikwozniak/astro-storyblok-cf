/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly STORYBLOK_ACCESS_TOKEN: string;
  readonly ZONE_ID: string;
  readonly API_TOKEN: string;
  readonly STORYBLOK_WEBHOOK_SECRET: string;
  readonly PUBLIC_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    runtime: {
      env: CloudflareEnv;
    };
  }
}

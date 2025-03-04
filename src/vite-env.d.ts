/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly REACT_APP_OPENWEATHER_API_KEY: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
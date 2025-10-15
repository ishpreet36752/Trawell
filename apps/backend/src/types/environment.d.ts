declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    FRONTEND_URL?: string;
    NODE_ENV?: "development" | "production" | "test";
    MONGODB_URI?: string;
  }
}

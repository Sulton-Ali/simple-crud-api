if (process.env.NODE_ENV !== 'production') {
  await import('dotenv/config');
}

export const env = {
  NODE_ENV: (process.env.NODE_ENV ?? 'production') as
    | 'development'
    | 'test'
    | 'production',

  PORT: Number(process.env.PORT ?? 4000),
  DB_PORT: Number(process.env.DB_PORT ?? 3000),
  IS_MULTI: process.env.IS_MULTI ?? false,
} as const;

export const isDev = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';

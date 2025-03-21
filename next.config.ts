import { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // @ts-expect-error - Ignoramos a verificação de tipo aqui
    turbo: false
  }
};

export default config;
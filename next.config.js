/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'i.pravatar.cc',
      'resizedimgs.zapimoveis.com.br',
      'a0.muscache.com',
      'maps.googleapis.com',
      'www.procuraseimovel.com.br',
      'www.correio24horas.com.br',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com'
    ],
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: [
      'i.pravatar.cc',
      'resizedimgs.zapimoveis.com.br',
      'pub-7fc1609786a2417db2ef29f9cf5936b3.r2.dev',
      'a0.muscache.com',
      'maps.googleapis.com',
      'www.procuraseimovel.com.br',
      'www.correio24horas.com.br',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'static.vecteezy.com',
      'pt.wikipedia.org'
    ],
  },
};

module.exports = nextConfig;

const fs = require('fs');
const path = require('path');

const generateSitemap = () => {
  const baseUrl = 'https://localeimoveis.com'; // Substitua pelo seu domínio
  const pagesDirectory = path.join(process.cwd(), 'pages');
  const staticPages = fs
    .readdirSync(pagesDirectory)
    .filter((staticPage) => {
      return !['_app.tsx', '_document.tsx', '_error.tsx', 'api'].includes(
        staticPage
      );
    })
    .map((staticPagePath) => {
      const pagePath = staticPagePath.replace('.tsx', '');
      return `${baseUrl}/${pagePath}`;
    });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages
      .map((url) => {
        return `
      <url>
        <loc>${url}</loc>
      </url>
    `;
      })
      .join('')}
  </urlset>
  `;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
};

generateSitemap();

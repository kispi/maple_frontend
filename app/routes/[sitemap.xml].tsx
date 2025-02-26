// import { $http } from '~/modules/axios'

export const loader = async () => {
  try {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
      http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
      <url>
    <loc>https://everymaple.com/</loc>
      </url>
    </urlset>`
    return new Response(sitemap, { headers: { 'Content-Type': 'application/xml' } })
  } catch (e) {
    return new Response('Failed to create a sitemap', { status: 500 })
  }
}
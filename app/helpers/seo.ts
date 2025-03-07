const bots = /bot|googlebot|slackbot|kakaotalk|facebookexternalhit|twitterbot|bingbot|yandexbot|naverbot|yeti|baiduspider|duckduckbot|applebot|ahrefsbot|semrushbot|ccbot|perplexitybot|amazonbot/i

const seo = {
  isDirectAccess: (request: Request) => request.headers.get('sec-fetch-dest') === 'document',
  isBot: (request: Request) => {
    const userAgent = request.headers.get('user-agent') || ''
    return bots.test(userAgent)
  },
}

export default seo
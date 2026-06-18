import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from '@remix-run/react'
import type { LinksFunction, MetaFunction } from '@remix-run/node'
import { createMetaTags } from './assets/constants/meta'
import AppHeader from './components/app/app-header/AppHeader'
import AppAddons from './components/app/addons/AppAddons'
import AppFooter from './components/app/app-footer/AppFooter'
import ClientOnly from './components/app/ClientOnly'
import useAppStore from './store/app'
import '~/assets/styles/index.scss'
import './font-awesome.css'
import './root.scss'

const createGoogleFontUrl = (itemStrings: string[]) => {
  const items = itemStrings.join('&')
  return `https://fonts.googleapis.com/css2?${items}&display=swap`
}

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: createGoogleFontUrl([
      'family=Noto+Sans+KR:wght@100..900',
      'family=Poppins:wght@200;300;400;500',
    ]),
  }, {
    rel: 'icon',
    href: '/favicon/favicon.ico',
  }, {
    rel: 'apple-touch-icon',
    href: '/favicon/icon-192x192.png',
  }, {
    rel: 'manifest',
    href: '/manifest.json',
  },
]

export const meta: MetaFunction = () => ([
  ...createMetaTags(),
  ...[
    { name: 'google-site-verification', content: 'e1Il9p10cWwATUd09D06pEn6EeZrPCdy3724P6k6Ib0' },
    { name: 'naver-site-verification', content: '388e9ec9156574ffb6886e0ddfeebd2353e48937' },
  ],
])

export const ErrorBoundary = () => {
  const error = useRouteError()

  return <div className="view-not-found">
    <img
      src="https://i.namu.wiki/i/Vy3qaQ2IvMaXucz3oK3iI4ao0oA8FS-rJn8jPcgzxjW7YxMfpP4j6Hf0X21G1JYzcYX6UZOxd53kpZahTkAOpg.gif"
      alt="404 Not Found"
    />
    <div className="f-24">[<b>{isRouteErrorResponse(error) ? error.status : ''}</b>] 페이지가 없습니다</div>

    <a href="/" className="btn btn-primary">메인으로</a>
  </div>
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { settings } = useAppStore()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={`theme-${settings.theme}`}>
        <AppHeader />
        <div className="app-body layout-centered">
          <main>{children}</main>
        </div>
        <AppFooter />
        <ClientOnly>
          <AppAddons />
        </ClientOnly>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  )
}

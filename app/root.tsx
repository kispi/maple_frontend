import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import type { LinksFunction, MetaFunction } from '@remix-run/node'
import { createMetaTags } from './assets/constants/meta'
import AppHeader from './components/app/app-header/AppHeader'
import AppNav from './components/app/app-nav/AppNav'
import AppFooter from './components/app/app-footer/AppFooter'
import useAppStore from './store/app'
import '~/assets/styles/index.scss'
import './font-awesome.css'

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
      'family=Ubuntu:ital,wght@1,700',
      'family=IBM+Plex+Sans+KR:wght@400;500;600;700',
    ]),
  },
]

export const meta: MetaFunction = () => ([
  ...createMetaTags(),
  ...[
    { name: 'google-site-verification', content: 'sJHY21K0pIbj_iV1G5KdPL0OUxDiHAwUdLMDyyQvqiA' },
    { name: 'naver-site-verification', content: '27118f24e98ba45698f9cf7b7de3c81a8d13fdc5' },
  ],
])

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
          {settings.showNav && <AppNav />}
          <main>{children}</main>
        </div>
        <AppFooter />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

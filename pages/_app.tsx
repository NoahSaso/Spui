import "../styles/globals.scss"
import "react-toastify/dist/ReactToastify.min.css"

import type { AppProps } from "next/app"
import Head from "next/head"
import { FunctionComponent } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { ToastContainer } from "react-toastify"
import { RecoilRoot } from "recoil"

import { DevicePickerContainer, Footer } from "@/components"
import { useTokenMonitor } from "@/hooks"
import { colors } from "@/theme"

const TITLE = "Spui"
const DESCRIPTION = "Alternate UI for Spotify."

const queryClient = new QueryClient()

const Spui: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  // Refresh access token automatically when it gets close to expiring.
  useTokenMonitor()

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0">
      <div className="relative w-full h-full overflow-hidden flex flex-col justify-start items-stretch max-w-lg pt-safe mx-auto sm:px-1">
        <main>
          <Component {...pageProps} />

          <DevicePickerContainer />
        </main>
        <Footer />
      </div>
    </div>
  )
}

const App: FunctionComponent<AppProps> = (props) => (
  <>
    <Head>
      <title>{TITLE}</title>

      {/* General */}
      <meta
        name="viewport"
        content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      />

      {/* PWA */}
      <link rel="manifest" href="/manifest.webmanifest" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="apple-mobile-web-app-title" content={TITLE} />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/safari-pinned-tab.svg"
        color={colors.spuiOrange}
      />
      <meta name="msapplication-TileColor" content={colors.spuiDark} />
      <meta name="theme-color" content={colors.spuiDark} />

      {/* SEO */}
      <meta name="description" content={DESCRIPTION} />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
    </Head>

    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Spui {...props} />
      </QueryClientProvider>
    </RecoilRoot>

    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar
      theme="light"
    />
  </>
)

export default App

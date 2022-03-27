import "../styles/globals.scss"

import type { AppProps } from "next/app"
import { FunctionComponent } from "react"
import { RecoilRoot } from "recoil"

import { useTokenMonitor } from "@/hooks"

const Spui: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  // Refresh access token automatically when it gets close to expiring.
  useTokenMonitor()

  return (
    <main>
      <Component {...pageProps} />
    </main>
  )
}

const App: FunctionComponent<AppProps> = (props) => (
  <RecoilRoot>
    <Spui {...props} />
  </RecoilRoot>
)

export default App

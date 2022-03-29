import "../styles/globals.scss"
import "react-toastify/dist/ReactToastify.min.css"

import type { AppProps } from "next/app"
import { FunctionComponent } from "react"
import { ToastContainer } from "react-toastify"
import { RecoilRoot } from "recoil"

import { DevicePickerContainer, Footer } from "@/components"
import { useTokenMonitor } from "@/hooks"

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
    <RecoilRoot>
      <Spui {...props} />
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

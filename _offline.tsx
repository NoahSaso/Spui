import Head from "next/head"
import { FC } from "react"

const Offline: FC = () => (
  <>
    <Head>
      <title>Spui | Offline</title>
      <meta name="description" content="Offline fallback page." />
    </Head>
    <div className="mt-10">
      <h1>
        Sorry! Offline mode doesn&apos;t seem to be working :&#40;
        <br />
        <br />
        Reload me once you come back online, and offline mode should work again.
      </h1>
    </div>
  </>
)

export default Offline

import Head from "next/head";
import { AppProps } from "next/app";
import "../styles/index.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Awesome Caption Generator</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <script
          type="text/javascript"
          src="https://unpkg.com/mediainfo.js/dist/mediainfo.min.js"
        ></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

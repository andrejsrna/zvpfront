import { GoogleAdSense } from "nextjs-google-adsense";
import { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <GoogleAdSense publisherId="pub-7459831240640476" />
      <Component {...pageProps} />
    </>
  );
};

export default App;
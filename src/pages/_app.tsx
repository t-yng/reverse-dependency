import type { AppProps } from "next/app";
import "../styles/App.css";
import { Button } from "../components/Button";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Button />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

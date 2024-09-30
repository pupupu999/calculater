import "@/styles/globals.css";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #27374D;
  }
`;

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
       <meta name="theme-color" content="#BFDBFE" media="(prefers-color-scheme: light)" />
          <meta name="theme-color" content="#1E3A8A" media="(prefers-color-scheme: dark)" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

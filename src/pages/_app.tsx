import '../styles/globals.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import Head from 'next/head';
import type { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<>
			<Head>
				<meta name='viewport' content='width=device-width, initial-scale=1' />

				{/* <!-- Primary Meta Tags --> */}
				<title>Dispatch</title>
				<meta name='title' content='DIMLIM' />
				<meta
					name='description'
					content='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
				/>

				{/* <!-- Open Graph / Facebook --> */}
				<meta property='og:type' content='website' />
				<meta property='og:url' content='https://dimlim.ml/' />
				<meta property='og:title' content='DIMLIM' />
				<meta
					property='og:description'
					content='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
				/>
				<meta
					property='og:image'
					content='https://dimlim.ml/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png'
				/>

				{/* <!-- Twitter --> */}
				<meta property='twitter:card' content='summary_large_image' />
				<meta property='twitter:url' content='https://dimlim.ml/' />
				<meta property='twitter:title' content='DIMLIM' />
				<meta
					property='twitter:description'
					content='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
				/>
				<meta
					property='twitter:image'
					content='https://dimlim.ml/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png'
				/>
			</Head>
			<Component {...pageProps} />
		</>
	);
};

export default App;

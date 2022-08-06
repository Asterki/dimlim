import React from 'react';
// import fetch from 'node-fetch';

import { GetServerSideProps, NextPage } from 'next';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (context.req.user !== undefined)
		return {
			redirect: {
				destination: '/home',
				permanent: false,
			},
		};

	return {
		props: {
			a: "a"
		},
	};
};

const Index: NextPage = (props: any) => {
	return (
		<div>
			<h1>ejeqweqweqweqewqewewqo</h1>
		</div>
	);
};

export default Index;

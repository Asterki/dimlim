/* eslint-disable @next/next/no-img-element */
import React from "react";

import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	return {
		redirect: {
			destination: "/home",
			permanent: false,
		},
	};
};

const ErrorPage: NextPage = (props: any) => {
	return <div>Redirecting</div>;
};

export default ErrorPage;

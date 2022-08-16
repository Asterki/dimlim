import * as React from "react";
import axios from "axios";

import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    if (context.req.user !== undefined)
        return {
            redirect: {
                destination: "/home",
                permanent: false,
            },
        };

    return {
        props: {
            a: "a",
        },
    };
};

const Register: NextPage = (props: any) => {
    return (
        <div>
            <h1>{props.lang.title}</h1>
        </div>
    );
};

export default Register;

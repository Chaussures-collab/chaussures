/** @format */

interface Props {
  title?: string;
  description?: string;
}

import React from "react";
import Head from "next/head";

export default function Seo({ title, description }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width-device-width, initial-scale=1" />
        <link rel="icon" href="" />
      </Head>
    </>
  );
}

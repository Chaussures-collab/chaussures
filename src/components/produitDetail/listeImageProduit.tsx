/** @format */

import Image from "next/image";
import React from "react";
interface Props {
  src: string;
  alt: string;
}

export default function ListeImageProduit({ src, alt }: Props) {
  return (
    <div className="relative w-full h-full flex items-center">
      <Image
        src={src}
        alt={alt}
        layout="responsive"
        width={381}
        height={450}
        objectFit="cover"
        // className="rounded-lg shadow-lg"
        className="object-cover rounded"
        sizes="80px"
      />
    </div>
  );
}

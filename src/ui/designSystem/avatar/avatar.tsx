/** @format */

import Image from "next/image";
import React from "react";
import clsx from "clsx";
interface Props {
  size?: "medium" | "small" | "large";
  src:string;
  alt: string;
  className?: string;
}
export default function Avatar({ size = "medium", src, alt, className }: Props) {
  let sizeStyles: string;
  switch (size) {
    case "small":
      sizeStyles = "w-[46px] h-[30px] md:w-[80px] md:h-[56px]";
      break;
    case "medium":
      sizeStyles = "w-[60px] h-[42px]";
      break;
    case "large":
      sizeStyles = "w-18 h-18";
      break;
  }
  return (
    <div className={clsx(sizeStyles,className, 'bg-gray-400 relative')}>
      <Image
      fill src={src} alt={alt} className="object-center "
      />
    </div>
  );
}

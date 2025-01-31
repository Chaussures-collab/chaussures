/** @format */

import React from "react";
import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: Props) {
  return (
    <div // Applique les style en ligne ici
      className={clsx(
        className,
        "w-full max-w-8xl mx-auto space-y-5",
        "px-2 sm:px-4 md:px-10 lg:px-20 xl:px-20" // Dynamique: Petit écran (2px), Tablette (10px)
      )}
    >
      {children}
    </div>
  );
}

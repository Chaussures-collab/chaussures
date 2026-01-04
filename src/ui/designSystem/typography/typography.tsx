/** @format */

import clsx from "clsx";
import React from "react";

interface Props {
  variant?:
    | "display"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "lead"
    | "body"
    | "body-lg"
    | "body-base"
    | "body-sm"
    | "caption1"
    | "caption2"
    | "caption3"
    | "caption4";
  component?: "h1" | "h2" | "h3" | "h4" | "h5" | "div" | "p" | "span";
  theme?: "black" | "white" | "gray" | "primary" | "secondary" | "red";
  weight?: "regular" | "medium" | "bold";
  className?: string;
  children: React.ReactNode;
}

export default function Typography({
  children,
  variant = "body",
  component: Component = "div",
  theme = "black",
  weight = "medium",
  className
}: Props) {
  // Styles pour les variantes
  const variantStyles: Record<string, string> = {
    display: "text-6xl lg:text-8xl",
    h1: "text-5xl lg:text-7xl",
    h2: "text-4xl lg:text-6xl",
    h3: "text-3xl lg:text-5xl",
    h4: "text-2xl lg:text-4xl",
    h5: "text-xl lg:text-3xl",
    lead: "text-2xl lg:text-xl",
    "body-lg": "text-lg lg:text-xl",
    body: "text-base lg:text-lg",
    "body-base": "text-base",
    "body-sm": "text-sm",
    caption1: "text-sm lg:text-base leading-snug text-gray-500",
    caption2: "text-xs lg:text-sm leading-snug text-gray-500",
    caption3: "text-[11px] lg:text-xs leading-tight text-gray-400",
    caption4:
      "text-[10px] lg:text-[11px] leading-tight text-gray-400 uppercase tracking-wide"
  };

  // Couleurs dynamiques
  const themeStyles: Record<string, string> = {
    black: "text-gray",
    gray: "text-gray-400",
    white: "text-white",
    primary: "text-primary",
    secondary: "text-secondary",
    red: "text-danger"
  };

  return (
    <Component
      className={clsx(
        variantStyles[variant],
        themeStyles[theme],
        {
          "font-normal": weight === "regular",
          "font-medium": weight === "medium",
          "font-bold": weight === "bold"
        },
        className
      )}>
      {children}
    </Component>
  );
}

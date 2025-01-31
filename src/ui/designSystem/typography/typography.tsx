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
  theme?: "black" | "white" | "gray" | "primary" | "secondary";
  weight?: "regular" | "medium" | "bold";
  className?: string;
  children: React.ReactNode;
}

export default function Typography({
  children,
  variant = "body",
  component: Component = "div",
  theme = "black",
  weight = "regular",
  className,
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
    caption1: "text-caption1 lg:text-sm",
    caption2: "text-caption2 lg:text-sm",
    caption3: "text-caption3 lg:text-sm",
    caption4: "text-caption4 lg:text-sm",
  };

  // Couleurs dynamiques
  const themeStyles: Record<string, string> = {
    black: "text-gray",
    gray: "text-gray-4",
    white: "text-white",
    primary: "text-primary",
    secondary: "text-secondary",
  };

  return (
    <Component
      className={clsx(
        variantStyles[variant],
        themeStyles[theme],
        {
          "font-medium": weight === "medium",
          "font-bold": weight === "bold",
        },
        className
      )}
    >
      {children}
    </Component>
  );
}

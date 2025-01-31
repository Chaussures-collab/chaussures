import React, { useState } from "react";
import clsx from "clsx";
import { IconProps } from "@/types/iconProps";
import Spinner from "@/ui/designSystem/spinner/spinner";
import { LinkType, LinkTypes } from "@/lib/link-type";
import Link from "next/link";

interface Props {
  size?: "small" | "medium" | "large"|"produit";
  variant?: "accent" | "secondary" | "outline" | "disabled" | "suivant" | "ico" | "outlineP";
  icon?: IconProps; // icon
  iconTheme?: "accent" | "secondary" | "gray";
  iconPosition?: "left" | "right";
  disabled?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
  baseUrl?: string;
  linkType?: LinkTypes;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  action?: Function;
  fullwidth?: boolean;
  type?: "button" | "submit";
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  onclick?: Function;
}

export default function Button({
  size = "medium",
  variant = "accent",
  icon,
  iconTheme = "accent",
  iconPosition = "right",
  disabled,
  className,
  isLoading,
  fullwidth = false,
  baseUrl,
  linkType = "internal",
  type = "button",
  action = () => {},
  children
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  let variantStyles: string = "",
    sizeStyles: string = "",
    icoSize: number = 0;

  switch (variant) {
    case "accent":
      variantStyles = "bg-primary hover:bg-primary-400 text-white";
      break;
    case "suivant":
      variantStyles = "bg-primary-1 hover:text-white hover:bg-primary text-gray";
      break;
    case "secondary":
      variantStyles =
        "bg-white hover:bg-secondary-300/50 text-black";
      break;
    case "outline":
      variantStyles =
        "border border-primary text-primary hover:bg-gray-4 ";
      break;
    case "disabled":
      variantStyles = "bg-gray-600 text-gray-700 ";
      break;
    case "ico":
      if (iconTheme === "accent") {
        variantStyles =
          "bg-primary hover:bg-primary-400 text-white";
      }
      if (iconTheme === "secondary") {
        variantStyles =
          "bg-white hover:bg-gray-4 text-black";
      }
      if (iconTheme === "gray") {
        variantStyles =
          "bg-gray-700 rimary  hover:bg-gray-600 text-white-full";
      }
      break;
  }

  switch (size) {
    case "small":
      sizeStyles = `text-h2 font-medium ${
        variant === "ico"
          ? "w-[40px] h-[40px] flex items-center justify-center"
          : "px-[14px] py-[12px]"
      }`;
      icoSize = 24;
      break;
      case "produit":
      sizeStyles = `text-caption3 font-medium ${
        variant === "ico"
          ? "w-[40px] h-[40px] w-[40px] h-[40px] flex items-center justify-center"
          : "px-[2px] py-[3px] sm:px-[14px] sm:py-[12px]"
      }`;
      icoSize = 24;
      break;
    case "medium":
      sizeStyles = `text-caption2 font-medium  ${
        variant === "ico"
          ? "w-[50px] h-[50px] flex items-center justify-center"
          : "px-[18px] py-[15px]"
      }`;
      icoSize = 24;
      break;
    case "large":
      sizeStyles = `text-caption1 font-medium  ${
        variant === "ico"
          ? "w-[40px] h-[40px] md:w-[60px] md:h-[60px] flex items-center justify-center"
          : "px-[22px] py-[18px]"
      }`;
      icoSize = 30;
      break;
  }

  const handClick = () => {
    if (action) {
      action();
    }
  };

  const handleFocus = () => {
    setIsFocused(true); // Mettre à jour l'état de focus
  };

  const handleBlur = () => {
    setIsFocused(false); // Restaurer l'état lorsqu'on perd le focus
  };

  const buttonContent = (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          {variant === "accent" || variant === "ico" ? (
            <Spinner size="small" variant="white" />
          ) : (
            <Spinner size="small" />
          )}
        </div>
      )}
      <div className={clsx(isLoading && "invisible")}>
        {icon && variant === "ico" ? (
          <icon.icon size={icoSize}></icon.icon>
        ) : (
          <div className={clsx(icon && "flex items-center gap-1")}>
            {icon && iconPosition === "left" && <icon.icon size={icoSize} />}
            {children}
            {icon && iconPosition === "right" && <icon.icon size={icoSize} />}
          </div>
        )}
      </div>
    </>
  );

  const buttonElement = (
    <>
      <button
        type={type}
        className={clsx(
          className,
          variantStyles,
          icoSize,
          sizeStyles,
          isLoading && "cursor-wait",
          "relative animate",
          fullwidth && "w-full",
          isFocused && "outline-none ring-2 ring-primary" // Ajout du style de focus
        )}
        onClick={handClick}
        onFocus={handleFocus} // Ajout de l'événement onFocus
        onBlur={handleBlur} // Ajout de l'événement onBlur
        disabled={disabled || isLoading ? true : false}
      >
        {buttonContent}
      </button>
    </>
  );

  if (baseUrl) {
    if (linkType === LinkType.EXTERNAL) {
      return (
        <a href={baseUrl} target="_blank">
          {buttonContent}
        </a>
      );
    } else {
      return <Link href={baseUrl}>{buttonElement}</Link>;
    }
  }
  return buttonElement;
}

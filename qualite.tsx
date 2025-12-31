/** @format */

import Typography from "@/ui/designSystem/typography/typography";
import React from "react";

interface Props {
  icon: React.ReactNode;
  description1: string;
  description2: string;
}

export default function Qualite({ icon, description1, description2 }: Props) {
  return (
    <div className="justify-center text-center m-auto items-center space-y-4 sm:space-y-0 sm:space-x-4">
      {/* Image container */}
      <div className="flex justify-center text-center items-center">{icon}</div>

      {/* Descriptions */}
      <div className="text-center justify-center space-y-2">
        <Typography variant="caption3" theme="black" weight="bold">
          {description1}
        </Typography>
        <Typography variant="caption1" theme="gray">
          {description2}
        </Typography>
      </div>
    </div>
  );
}

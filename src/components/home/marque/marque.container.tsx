/** @format */

import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";
import React from "react";

export default function MarqueContainer() {
  return (
    <div className="bg-primary-1">
      <Container className="justify-center items-center py-5 text-center">
        <Typography variant="h3" theme="primary">
          Toute marque confondue
        </Typography>
      </Container>
    </div>
  );
}

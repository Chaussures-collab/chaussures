/** @format */

import Container from "@/ui/components/container/container";
import Avatar from "@/ui/designSystem/avatar/avatar";
import Typography from "@/ui/designSystem/typography/typography";
import React from "react";

export default function Paiement() {
  return (
    <div>
      <Container className="bg-primary py-4">
        <Typography variant="h2" theme="white" className="text-center my-4">Moyen de livraisaon</Typography>
        <div className="flex gap-0 m:gap-12 my-4 m:py-10 sm:gap-20 lg:gap-40 justify-center items-center">
          <Avatar size="large" src="/assets/images/Apps-Relais-colis.jpg" alt="Logo" className="hover:scale-105 transition-transform duration-500" />
          <Avatar size="large" src="/assets/images/collissimo.jpg" alt="Logo" className="hover:scale-105 transition-transform duration-500" />
          <Avatar size="large" src="/assets/images/modial relay.png" alt="Logo" className="hover:scale-105 transition-transform duration-500" />
        </div>
      </Container>
    </div>
  );
}

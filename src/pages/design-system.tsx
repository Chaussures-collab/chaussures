/** @format */

import Seo from "@/ui/components/seo/seo";
import Avatar from "@/ui/designSystem/avatar/avatar";
import Button from "@/ui/designSystem/button/button";
import Typography from "@/ui/designSystem/typography/typography";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

export default function index() {
  return (
    <div>
      <Seo title="E-commerce" description="E-commerce description" />
      <div className="space-w-4">
        <Button variant="accent" size="medium"> Eskay_dev</Button>
        <Button variant="outline" size="medium"> Eskay_dev</Button>
        <Button variant="ico" size="medium" iconTheme="accent" icon={{ icon: FaArrowRight}}/>
        <Button variant="ico" size="medium" iconTheme="secondary" icon={{ icon: FaArrowRight}} className="rounded-full shadow shadow-gray-3"/>
      </div>
      <div className="flex items-center space-x-2"><Avatar src= "/assets/images/logo.png" alt="logo" />
        <Typography variant="h3" theme="black" component="h3" weight="medium">
          Market
        </Typography>
      </div>
      <div>
{/*         <Button variant="accent" size="medium"><Avatar src="/assets/images/logo.png" alt="logo" /> Eskay_dev</Button>
 */}        <Button variant="accent" size="medium"> Eskay_dev</Button>
        <Button variant="outline" size="medium"> Eskay_dev</Button>
        <Typography variant="h1" theme="black">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque, et?
        </Typography>
        <Typography variant="h2" theme="gray">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque, et?
        </Typography>
        <Typography variant="h3" theme="primary" weight="medium">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque, et?
        </Typography>
        <Typography variant="body-lg" theme="white" weight="regular">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque, et?
        </Typography>
        <Typography variant="body-base">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque, et?
        </Typography>
        <Typography variant="body-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque, et?
        </Typography>
        <Typography variant="caption1">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque, et?
        </Typography>
        <Typography variant="caption2" weight="medium">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque, et?
        </Typography>
        <Typography variant="caption3">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque, et?
        </Typography>
        <Typography variant="caption4" weight="medium">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque, et?
        </Typography>
        
      </div>
    </div>
  );
}

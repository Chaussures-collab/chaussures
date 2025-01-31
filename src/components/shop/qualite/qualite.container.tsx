import Container from '@/ui/components/container/container'
import React from 'react'
import Qualite from './qualite'
import { TbTruckDelivery } from "react-icons/tb";
import { GiTrophyCup } from 'react-icons/gi';
import { GrStatusGood } from 'react-icons/gr';

export default function qualiteContainer() {
  return (
    <Container className='grid grid-rows-1 grid-cols-4 gap-4 justify-center items-center min-h-32 bg-primary-1 pb-2 pt-2'>
      <Qualite icon={<GiTrophyCup className="text-4xl md:text-7xl text-gray-900"/>} description1='Haute qualité' description2='Fabriqué avec des matériaux premium'/>
      <Qualite icon={<TbTruckDelivery className="text-4xl md:text-7xl text-gray-900" />} description1='Livraison rapide' description2='Livraison en 24h dans le monde entier'/>
      <Qualite icon= {<GrStatusGood className="text-4xl md:text-7xl text-gray-900" />} description1='Livraison gratuite' description2='Commande de plus de 150 $'/>{/* Protection de garantie' description2='Plus de 2 ans'/> */}
      <Qualite icon={<GiTrophyCup className="text-4xl md:text-7xl text-gray-900"/>} description1='Assistance 24h/24 et 7j/7' description2='Assistance dédiée'/>
    </Container>
  )
}

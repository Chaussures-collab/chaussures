import Paiement from '@/components/shop/paiement/paiement'
import QualiteContainer from '@/components/shop/qualite/qualite.container'
import Layout from '@/ui/components/layout/layout'
import Seo from '@/ui/components/seo/seo'
import React from 'react'

export default function Commande() {
  return (
    <>
      <Seo title="Markets" description="E-commerce" />
      <Layout isDisplayCreadCrumbs={false}>
        
        <QualiteContainer/>
        <Paiement/>
      </Layout>
    </>
  )
}

import ProduitContainer from '@/components/formulaire/produit.container'
import QualiteContainer from '@/components/shop/qualite/qualite.container'
import ShobLink from '@/components/shop/shobLink/shobLink'
import Layout from '@/ui/components/layout/layout'
import Seo from '@/ui/components/seo/seo'
import React from 'react'

export default function Produit() {
  return (
    <>
          <Seo title="Insertion de produit" description="Formulaire de produit" />
    
          <Layout isDisplayCreadCrumbs={false}>
            <ShobLink />
            <ProduitContainer />
            <QualiteContainer />
          </Layout>
        </>
  )
}

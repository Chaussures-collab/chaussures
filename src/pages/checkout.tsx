import CheckoutContainer from '@/components/checkout/checkout.container'
import QualiteContainer from '@/components/shop/qualite/qualite.container'
import ShobLink from '@/components/shop/shobLink/shobLink'
import { REGISTERED } from '@/lib/session-status'
import Layout from '@/ui/components/layout/layout'
import Seo from '@/ui/components/seo/seo'
import React from 'react'

export default function Checkout() {
  return (
    <>
          <Seo title="Markets" description="Caisse en ligne" />
    
          <Layout sessionStatus= {REGISTERED} isDisplayCreadCrumbs={false}>
            <ShobLink />
            <CheckoutContainer/>
            <QualiteContainer/>
          </Layout>
        </>
  )
}

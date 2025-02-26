import React, { useState } from 'react'
import ShopkeeperHeader from '../Components/ShopkeeperHeader'
import NewInvoice from '../Components/NewInvoice'
import InvoiceDetails from '../Components/InvoiceDetails'

const Invoice = () => {
  const [Invoice_Data, Set_Invoice_Data] = useState({})
  return (
    <div>
      <ShopkeeperHeader />
      console.log(Invoice_Data)
      {
        Invoice_Data.Complete_Invoice ? <InvoiceDetails Invoice={Invoice_Data} /> : <NewInvoice Set_Invoice={Set_Invoice_Data} />
      }


    </div>
  )
}

export default Invoice
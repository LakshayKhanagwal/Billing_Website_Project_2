import React, { useState } from 'react'
import ShopkeeperHeader from '../Components/ShopkeeperHeader'
import AddExcelData from '../Components/AddExcelData'
import ReviewExcelData from '../Components/ReviewExcelData'

const UploadExcel = () => {
  const [Product_Excel_Data, Set_Product_Excel_Data] = useState([])

  return (
    <div>
      <ShopkeeperHeader />
      {
        Product_Excel_Data && Product_Excel_Data.length !== 0 ? <ReviewExcelData Product_Excel={Product_Excel_Data} Set_Product_Excel={Set_Product_Excel_Data}/> : <AddExcelData Product_Excel={Set_Product_Excel_Data} />
      }

    </div>
  )
}

export default UploadExcel
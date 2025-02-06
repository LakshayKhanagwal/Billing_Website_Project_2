import React, { useRef } from 'react'
import Title from '../../CommonComponents/Title'
import Footer from '../../CommonComponents/Footer'
import * as xlsx from "xlsx"

const AddExcelData = ({ Product_Excel }) => {
  const File_Upload = useRef()

  const Upload = (e) => {
    const Excel_File = e.target.files[0]
    if (!Excel_File) return
    if (Excel_File?.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") return alert("Only Excel Files are Allowed.")

    const reader = new FileReader()
    reader.readAsArrayBuffer(Excel_File)
    reader.onload = () => {
      const WorkBook = xlsx.read(reader.result, { type: 'buffer' })
      const WorkSheetName = WorkBook.SheetNames[0]
      const WorkSheet = WorkBook.Sheets[WorkSheetName]
      const Final_WorkSheet_Data = xlsx.utils.sheet_to_json(WorkSheet)

      if (!Final_WorkSheet_Data[0].name || !Final_WorkSheet_Data[0].model || !Final_WorkSheet_Data[0].description || !Final_WorkSheet_Data[0].company || !Final_WorkSheet_Data[0].price || !Final_WorkSheet_Data[0].rate || !Final_WorkSheet_Data[0].tax || !Final_WorkSheet_Data[0].discount || !Final_WorkSheet_Data[0].stock) return alert("Excel Sheet is not in Proper Format. Please Select Proper formated excel Sheet.")
      Product_Excel(Final_WorkSheet_Data)
    }
  }
  
  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <Title Name={"New Product"} />
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body">
                  <div className="p-2">
                    <form>
                      <div className="dropzone mb-3">
                        <div className="fallback">
                          <input ref={File_Upload} accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' onChange={Upload} name="file" type="file" multiple="multiple" hidden />
                        </div>
                        <div onClick={() => File_Upload.current.click()} style={{ textAlign: "center" }} className="dz-message needsclick">
                          <div className="mb-3">
                            <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                          </div>
                          <h4>Drop files here or click to upload.</h4>
                        </div>
                      </div>
                      <ul className="list-unstyled" id="dropzone-preview">
                        <li className="mt-2" id="dropzone-preview-list">
                          <div className="border rounded">
                            <div className="d-flex p-2">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm bg-light rounded">
                                  <img data-dz-thumbnail className="img-fluid rounded d-block" src="assets/images/new-document.png" />
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <div className="pt-1">
                                  <h5 className="fs-14 mb-1" data-dz-name>&nbsp;</h5>
                                  <p className="fs-13 text-muted mb-0" data-dz-size />
                                  <strong className="error text-danger" data-dz-errormessage />
                                </div>
                              </div>
                              <div className="flex-shrink-0 ms-3">
                                <button data-dz-remove className="btn btn-sm btn-danger">Delete</button>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AddExcelData
import React, { useState } from 'react'

const EditExcelProduct = (props) => {
    const [Loading, Set_Loading] = useState(false)
    const [Updated_Data, Set_Updated_Data] = useState(props.Product_Data)

    const set = (e) => Set_Updated_Data({ ...Updated_Data, [e.target.name]: e.target.value })

    const Update = (e) => {
        e.preventDefault()
        console.log(Updated_Data)
        try {
            if (!Updated_Data.name  || !Updated_Data.model  || !Updated_Data.company  || !Updated_Data.description || !Updated_Data.price  || !Updated_Data.rate || !Updated_Data.discount || !Updated_Data.stock || !Updated_Data.tax) return alert("All Fields are Mandatory.")
            Set_Loading(true)
            props.Set_Product_Data(Updated_Data)
            props.fun(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <div className="modal fade show" style={{ display: "block" }} id="addtaxModal" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0">
                        <div className="modal-header p-4 pb-0">
                            <h5 className="modal-title" id="createMemberLabel">Edit Product Details</h5>
                            <button onClick={() => props.fun(false)} type="button" className="btn-close" id="createMemberBtn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body p-4">
                            <form onSubmit={Update}>
                                <div className="col-lg-12">
                                    <div className='row'>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Product Name</label>
                                            <input type="text" className="form-control" name='name' placeholder="Enter Product Name" onChange={set} value={Updated_Data.name} />
                                        </div>
                                        <div className='row'>
                                            <div className="mb-3 col-6">
                                                <label htmlFor="model" className="form-label">Product Model</label>
                                                <input type="text" className="form-control" name='model' placeholder="Enter Product Model" onChange={set} value={Updated_Data.model} />
                                            </div>
                                            <div className="mb-3 col-6">
                                                <label htmlFor="company" className="form-label">Company Name</label>
                                                <input type="text" className="form-control" name='company' placeholder="Enter Company" onChange={set} value={Updated_Data.company} />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">Product Description</label>
                                            <textarea type="text" className="form-control" name='description' placeholder="Enter Product Description" onChange={set} value={Updated_Data.description} />
                                        </div>
                                        <div className='row'>
                                            <div className="mb-3 col-6">
                                                <label htmlFor="price" className="form-label">Price</label>
                                                <input type="number" className="form-control" name='price' placeholder="Price/-" onChange={set} value={Updated_Data.price} />
                                            </div>
                                            <div className="mb-3 col-6">
                                                <label htmlFor="rate" className="form-label">Rating</label>
                                                <input type="number" step="0.01" className="form-control" name='rate' placeholder="Enter Rating" onChange={set} value={Updated_Data.rate} />
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="mb-3 col-6">
                                                <label htmlFor="tax" className="form-label">Tax(%)</label>
                                                <input type="number" className="form-control" name='tax' placeholder="Enter Tax %" onChange={set} value={Updated_Data.tax} />
                                            </div>
                                            <div className="mb-3 col-6">
                                                <label htmlFor="discount" className="form-label">Discount(%)</label>
                                                <input type="number" className="form-control" name='discount' placeholder="Enter Discount %" onChange={set} value={Updated_Data.discount} />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="stock" className="form-label">Stock</label>
                                            <input type="number" className="form-control" name='stock' placeholder="Enter Stock" onChange={set} value={Updated_Data.stock} />
                                        </div>
                                        <div className="hstack gap-2 justify-content-end">
                                            <button type="button" onClick={() => props.fun(false)} className="btn btn-light" data-bs-dismiss="modal">Close</button>
                                            <button type="submit" disabled={Loading} className="btn btn-success" id="addNewMember">{Loading ? "Updating..." : "Update"}</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop fade show"></div>
        </div>
    )
}

export default EditExcelProduct
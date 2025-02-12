import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AddProductModal = (props) => {
    const [Loading, Set_Loading] = useState(false)
    const [Product_Details, Set_Product_Details] = useState([])
    const navigate = useNavigate()

    const set = (e) => Set_Product_Details({ ...Product_Details, [e.target.name]: e.target.value })

    useEffect(() => {
        if (props.Product_Data) return Set_Product_Details(props.Product_Data)
    }, [])

    const Save = async (e) => {
        try {
            e.preventDefault()
            Set_Loading(true)

            const User_Data = JSON.parse(localStorage.getItem("User_Data"))
            if (!User_Data || !User_Data.Authorization_Token) {
                localStorage.clear()
                window.history.replaceState(null, null, "/")
                navigate("/")
            }
            const Product_Add_ACK = await fetch("http://localhost:3100/Api/Add_Product", {
                method: "post",
                body: JSON.stringify(Product_Details),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": User_Data.Authorization_Token
                }
            })
            const Product_Add_ACK_JSON = await Product_Add_ACK.json()
            alert(Product_Add_ACK_JSON?.Message)
            if (Product_Add_ACK.status === 400) return Set_Loading(false)
            props.Fetch_Product(User_Data.Authorization_Token)
            props.setToggle(false)
        } catch (error) {
            console.log(error)
        }
    }

    const Update = async (e) => {
        try {
            e.preventDefault()
            Set_Loading(true)

            const User_Data = JSON.parse(localStorage.getItem("User_Data"))
            if (!User_Data || !User_Data.Authorization_Token) {
                localStorage.clear()
                window.history.replaceState(null, null, "/")
                navigate("/")
            }
            const Product_Add_ACK = await fetch("http://localhost:3100/Api/Update_Product/" + props.Product_Data._id, {
                method: "put",
                body: JSON.stringify(Product_Details),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": User_Data.Authorization_Token
                }
            })
            const Product_Add_ACK_JSON = await Product_Add_ACK.json()
            alert(Product_Add_ACK_JSON?.Message)
            if (Product_Add_ACK.status === 202) {
                props.Fetch_Product(User_Data.Authorization_Token)
                return props.Set_Edit_Toggle(false)
            }
            return Set_Loading(false)
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
                            {props.setToggle && (<h5 className="modal-title" id="createMemberLabel">Add Product</h5>)}
                            {props.Edit_Toggle && (<h5 className="modal-title" id="createMemberLabel">Edit Product Details</h5>)}
                            <button onClick={() => props.setToggle ? props.setToggle(false) : props.Set_Edit_Toggle(false)} type="button" className="btn-close" id="createMemberBtn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body p-4">
                            <form onSubmit={props.setToggle ? Save : Update}>
                                <div className="col-lg-12">
                                    <div className='row'>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Product Name</label>
                                            <input type="text" className={props.setToggle ? "form-control" : "form-control Cursor_Disable"} disabled={props.setToggle ? false : true} name='name' placeholder="Enter Product Name" value={Product_Details?.name} onChange={set} />
                                        </div>
                                        <div className='row'>
                                            <div className="mb-3 col-6">
                                                <label htmlFor="model" className="form-label">Product Model</label>
                                                <input type="text" className={props.setToggle ? "form-control" : "form-control Cursor_Disable"} disabled={props.setToggle ? false : true} name='model' placeholder="Enter Product Model" value={Product_Details?.model} onChange={set} />
                                            </div>
                                            <div className="mb-3 col-6">
                                                <label htmlFor="company" className="form-label">Company Name</label>
                                                <input type="text" className={props.setToggle ? "form-control" : "form-control Cursor_Disable"} disabled={props.setToggle ? false : true} name='company' placeholder="Enter Company" value={Product_Details?.company} onChange={set} />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">Product Description</label>
                                            <textarea type="text" className={props.setToggle ? "form-control" : "form-control Cursor_Disable"} disabled={props.setToggle ? false : true} name='description' placeholder="Enter Product Description" value={Product_Details?.description} onChange={set} />
                                        </div>
                                        <div className='row'>
                                            <div className="mb-3 col-6">
                                                <label htmlFor="price" className="form-label">Price</label>
                                                <input type="number" className="form-control" name='price' placeholder="Price/-" value={Product_Details?.price} onChange={set} />
                                            </div>
                                            <div className="mb-3 col-6">
                                                <label htmlFor="rate" className="form-label">Rating</label>
                                                <input type="number" step="0.01" className="form-control" name='rate' placeholder="Enter Rating" value={Product_Details?.rate} onChange={set} />
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="mb-3 col-6">
                                                <label htmlFor="tax" className="form-label">Tax(%)</label>
                                                <input type="number" className="form-control" name='tax' placeholder="Enter Tax %" value={Product_Details?.tax} onChange={set} />
                                            </div>
                                            <div className="mb-3 col-6">
                                                <label htmlFor="discount" className="form-label">Discount(%)</label>
                                                <input type="number" className="form-control" name='discount' placeholder="Enter Discount %" value={Product_Details?.discount} onChange={set} />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="stock" className="form-label">Stock</label>
                                            <input type="number" className="form-control" name='stock' placeholder="Enter Stock" value={Product_Details?.stock} onChange={set} />
                                        </div>
                                        <div className="hstack gap-2 justify-content-end">
                                            <button type="button" onClick={() => props.setToggle ? props.setToggle(false) : props.Set_Edit_Toggle(false)} className="btn btn-light" data-bs-dismiss="modal">Close</button>
                                            {props.setToggle && (<button type="submit" disabled={Loading} className="btn btn-success" id="addNewMember">{Loading ? "Saving..." : "Save"}</button>)}
                                            {props.Edit_Toggle && (<button type="submit" disabled={Loading} className="btn btn-success" id="addNewMember">{Loading ? "Updating..." : "Update"}</button>)}
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

export default AddProductModal
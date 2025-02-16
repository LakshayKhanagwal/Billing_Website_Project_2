import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AddCustomerModal = (props) => {

    const [Customer_Details, Set_Customer_Details] = useState({})
    const [Loading, Set_Loading] = useState(false)
    const navigate = useNavigate()

    const set = (e) => Set_Customer_Details({ ...Customer_Details, [e.target.name]: e.target.value })

    const Add_Customer = async (e) => {
        try {
            e.preventDefault()
            Set_Loading(true)
            const User_Data = JSON.parse(localStorage.getItem("User_Data"))
            if (!User_Data || !User_Data.Authorization_Token) {
                localStorage.clear()
                window.history.replaceState(null, null, "/")
                navigate("/")
            }
            const Add_Customer_ACK = await fetch("http://localhost:3100/Api/Add_Customer", {
                method: "post",
                body: JSON.stringify(Customer_Details),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": User_Data.Authorization_Token
                }
            })
            const Add_Customer_ACK_JSON = await Add_Customer_ACK.json()
            alert(Add_Customer_ACK_JSON.Message)
            if (Add_Customer_ACK.status === 202) return props.Reload(User_Data.Authorization_Token), props.setToggle(false)
            Set_Loading(false)
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <div>
            <div class="modal-backdrop fade show"></div>
            <div className="modal fade show" style={{ display: "block" }} id="addpaymentModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0">
                        <div className="modal-header p-4 pb-0">
                            <h5 className="modal-title" id="createMemberLabel">Add Customer</h5>
                            <button type="button" onClick={() => props.setToggle(false)} className="btn-close" id="createMemberBtn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body p-4">
                            <form onSubmit={Add_Customer}>
                                <div className="row">
                                    <div className="mb-3 col-6">
                                        <label htmlFor="Name" className="form-label">Name</label>
                                        <input type="text" onChange={set} className="form-control" name="name" placeholder="Enter Name" />
                                    </div>
                                    <div className="mb-3 col-6">
                                        <label htmlFor="phone" className="form-label">Phone</label>
                                        <input type="number" onChange={set} className="form-control" name='phone' placeholder="Enter phone Number" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Address</label>
                                        <textarea onChange={set} className="form-control" placeholder="Enter Address of Customer." name="address" />
                                    </div>
                                    <div className="hstack gap-2 justify-content-end">
                                        <button type="button" className="btn btn-light" onClick={() => props.setToggle(false)} >Close</button>
                                        <button type="submit" disabled={Loading} className="btn btn-success" id="addNewMember">{Loading ? "Adding Customer...." : "Add Customer"}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddCustomerModal
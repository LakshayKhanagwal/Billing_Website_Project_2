import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const InvoiceAddCustomerModal = (props) => {

    const [Customers, Set_Customers] = useState([])
    const [Searched_Customers, Set_Searched_Customers] = useState([])
    const [Search_Phrase, Set_Search_Phrase] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (Customers.length !== 0) {
            const data = Customers.filter(Customer_Data => Customer_Data.name.includes(Search_Phrase) || Customer_Data.phone.includes(Search_Phrase))
            Set_Searched_Customers(data)
        }
    }, [Search_Phrase])

    useEffect(() => {
        const Fatch_Customer_Helper = async () => {
            const User_Data = JSON.parse(localStorage.getItem("User_Data"))
            if (User_Data && User_Data.Authorization_Token) return await Fatch_Customer(User_Data.Authorization_Token)
            localStorage.clear()
            window.history.replaceState(null, null, "/")
            navigate("/", { replace: true })
        }
        Fatch_Customer_Helper()
    }, [])

    const Fatch_Customer = async (token) => {
        try {
            const Customers = await fetch("http://localhost:3100/Api/Get_All_Customer", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
            const Customers_JSON = await Customers.json()
            if (Customers.status === 202) return Set_Customers(Customers_JSON.Data)
            alert(Customers_JSON?.Message)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show" style={{ display: "block" }} id="addpaymentModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0">
                        <div className="modal-header p-4 pb-0">
                            <h5 className="modal-title" id="createMemberLabel">Search for Customer</h5>
                            <button type="button" onClick={() => props.setToggle(false)} className="btn-close" id="createMemberBtn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body p-4">
                            <div className="row">
                                <div className="col-lg-12">
                                    <form onSubmit={'/'} href="#" className="app-search me-2">
                                        <div className="position-relative">
                                            <input type="text" onChange={(e) => Set_Search_Phrase(e.target.value)} className="form-control custominputwidth" placeholder="Search..." autoComplete="off" />
                                            <span className="las la-search search-widget-icon" />
                                            <span className="mdi mdi-close-circle search-widget-icon search-widget-icon-close d-none" />
                                        </div>
                                    </form>
                                    {
                                        Search_Phrase && Searched_Customers && Searched_Customers.length !== 0 && (
                                            <table className='table table-bordered table-hover table-striped'>
                                                <thead>
                                                    <tr>
                                                        <th>Sr no.</th>
                                                        <th>Name</th>
                                                        <th>Phone</th>
                                                        <th>Balance</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        Searched_Customers?.map((Data_Customers,index)=>{
                                                            return(
                                                                <tr className='Cursor_hover' onClick={()=>{props.Set_Customer(Data_Customers);props.setToggle(false)}}>
                                                                    <td>{index+1}</td>
                                                                    <td>{Data_Customers.name}</td>
                                                                    <td>{Data_Customers.phone}</td>
                                                                    <td>{Data_Customers.balance}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoiceAddCustomerModal

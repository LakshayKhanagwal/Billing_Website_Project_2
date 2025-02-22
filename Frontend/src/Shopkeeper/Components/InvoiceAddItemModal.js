import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const InvoiceAddItemModal = (props) => {
    const [Product, Set_Product] = useState([])
    const [Searched_Product, Set_Searched_Product] = useState([])
    const [Search_Phrase, Set_Search_Phrase] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (Product.length !== 0) {
            const data = Product.filter(Product_Data => Product_Data.name.includes(Search_Phrase) || Product_Data.phone.includes(Search_Phrase))
            Set_Searched_Product(data)
        }
    }, [Search_Phrase])

    useEffect(() => {
        const Fatch_Product_Helper = async () => {
            const User_Data = JSON.parse(localStorage.getItem("User_Data"))
            if (User_Data && User_Data.Authorization_Token) return await Fatch_Product(User_Data.Authorization_Token)
            localStorage.clear()
            window.history.replaceState(null, null, "/")
            navigate("/", { replace: true })
        }
        Fatch_Product_Helper()
    }, [])

    const Fatch_Product = async (token) => {
        try {
            const Product = await fetch("http://localhost:3100/Api/Get_Products", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
            const Product_JSON = await Product.json()
            if (Product.status === 202) return Set_Product(Product_JSON.Data)
            alert(Product_JSON?.Message)
        } catch (error) {
            console.log(error)
        }
    }
    console.log(Product)
    console.log(Search_Phrase)
    console.log(Searched_Product)

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
                                        Search_Phrase && Searched_Product && Searched_Product.length !== 0 && (
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
                                                        Searched_Product?.map((Data_Product, index) => {
                                                            return (
                                                                <tr className='Cursor_hover' onClick={() => { props.Set_Product.push(Data_Product); props.setToggle(false) }}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{Data_Product.name}</td>
                                                                    <td>{Data_Product.phone}</td>
                                                                    <td>{Data_Product.balance}</td>
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

export default InvoiceAddItemModal

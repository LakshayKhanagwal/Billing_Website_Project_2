import React, { useEffect, useState } from 'react'
import AddCustomerModal from './AddCustomerModal'
import { Link, useNavigate } from 'react-router-dom'
import Title from "../../CommonComponents/Title"
import Footer from "../../CommonComponents/Footer"
const CustomerComponent = () => {
    const [CustomerToggle, setCustomerToggle] = useState(false)

    const [Customer_Data, Set_Customer_Data] = useState([])
    const [Updated_Customer_Data, Set_Updated_Customer_Data] = useState([])

    const [Current_Page, Set_Current_Page] = useState(1)
    const [Customer_Count, Set_Customer_Count] = useState({})
    const [Total_Pages, Set_Total_Pages] = useState(0)
    const Customers_Per_Page = 5

    const navigate = useNavigate()

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

    useEffect(() => {
        if (Customer_Data.length !== 0) {
            const Last_Customer_Index = Current_Page * Customers_Per_Page
            const First_Customer_Index = Last_Customer_Index - Customers_Per_Page
            const Current_Visible_Customers = Customer_Data.slice(First_Customer_Index, Last_Customer_Index)
            const Total_Page_Count = Math.ceil(Customer_Data.length / Customers_Per_Page)

            Set_Customer_Count({ First_Index: First_Customer_Index + 1, Last_Index: Current_Visible_Customers.length + First_Customer_Index, Total_Users: Customer_Data.length })
            Set_Total_Pages(Total_Page_Count)
            Set_Updated_Customer_Data(Current_Visible_Customers)
        }
    }, [Customer_Data, Current_Page])

    const Fatch_Customer = async (token) => {
        try {
            const Customers = await fetch("http://localhost:3100/Api/Get_All_Customer", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
            const Customers_JSON = await Customers.json()
            if (Customers.status === 202) return Set_Customer_Data(Customers_JSON.Data)
            alert(Customers_JSON?.Message)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <Title Name="Our Customers" />
                        <div className="row pb-4 gy-3">
                            <div className="col-sm-4">
                                <button className="btn btn-primary addPayment-modal" onClick={() => setCustomerToggle(!CustomerToggle)} ><i className="las la-plus me-1" /> Add Customer</button>
                            </div>
                            <div className="col-sm-auto ms-auto">
                                <div className="d-flex gap-3">
                                    <div className="search-box">
                                        <input type="text" className="form-control" id="searchMemberList" placeholder="Search for Result" />
                                        <i className="las la-search search-icon" />
                                    </div>
                                    <div className>
                                        <button type="button" id="dropdownMenuLink1" data-bs-toggle="dropdown" aria-expanded="false" className="btn btn-soft-info btn-icon fs-14"><i className="las la-ellipsis-v fs-18" /></button>
                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink1">
                                            <li><a className="dropdown-item" href="#">All</a></li>
                                            <li><a className="dropdown-item" href="#">Last Week</a></li>
                                            <li><a className="dropdown-item" href="#">Last Month</a></li>
                                            <li><a className="dropdown-item" href="#">Last Year</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="tab-content text-muted pt-2">
                                            <div className="tab-pane active" id="nav-border-top-all" role="tabpanel">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="table-responsive table-card">
                                                            <table className="table table-hover table-nowrap align-middle mb-0">
                                                                <thead className="table-light">
                                                                    <tr className="text-muted text-uppercase">
                                                                        <th scope="col" style={{ width: "5%" }}>Sr. No.</th>
                                                                        <th scope="col" style={{ width: '10%' }}>Date</th>
                                                                        <th scope="col" style={{ width: "20%" }}>Name</th>
                                                                        <th scope="col" style={{ width: "15%" }}>Phone</th>
                                                                        <th scope="col" style={{ width: "24%" }}>Address</th>
                                                                        <th scope="col" style={{ width: '10%' }}>Balance</th>
                                                                        <th scope="col" style={{ width: '8%' }}>Status</th>
                                                                        <th scope="col" style={{ width: '8%' }}>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        Updated_Customer_Data && Updated_Customer_Data.length > 0 ? Updated_Customer_Data.map((Customer, index) => {
                                                                            return (
                                                                                <tr>
                                                                                    <td>{index + 1}</td>
                                                                                    <td>{Customer.createdat ? new Date(Customer.createdat).toLocaleDateString('en-GB', { day: 'numeric', month: "short" }) : "-"}</td>
                                                                                    <td>{Customer.name}</td>
                                                                                    <td>{Customer.phone}</td>
                                                                                    <td>{Customer.address}</td>
                                                                                    <td>{Customer.balance}</td>
                                                                                    <td>{Customer.balance === 0 ? (<span className="badge bg-success-subtle text-success p-2">Paid</span>) : <span className="badge bg-danger-subtle text-danger p-2">Pending</span>}</td>
                                                                                    <td>
                                                                                        <div className="dropdown">
                                                                                            <button className="btn btn-soft-secondary btn-sm dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                                                <i className="las la-ellipsis-h align-middle fs-18" />
                                                                                            </button>
                                                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                                                <li>
                                                                                                    <Link to={'/TransactionList'} > <button className="dropdown-item" href="javascript:void(0);"><i className="las la-eye fs-18 align-middle me-2 text-muted" />
                                                                                                        View</button></Link>
                                                                                                </li>
                                                                                                <li className="dropdown-divider" />
                                                                                                {
                                                                                                    Customer.balance === 0 && (
                                                                                                        <li>
                                                                                                            <span className="dropdown-item remove-item-btn Cursor_hover" href="#">
                                                                                                                <i className="las la-trash-alt fs-18 align-middle me-2 text-muted" />
                                                                                                                Delete
                                                                                                            </span>
                                                                                                        </li>
                                                                                                    )
                                                                                                }
                                                                                            </ul>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        }) : ""
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row align-items-center mb-2 gy-3">
                                            <div className="col-md-5">
                                                <p className="mb-0 text-muted">Showing <b>{Customer_Count?.First_Index}</b> to <b>{Customer_Count?.Last_Index}</b> of <b>{Customer_Count?.Total_Users}</b> results</p>
                                            </div>
                                            <div className="col-sm-auto ms-auto">
                                                <nav aria-label="...">
                                                    <ul className="pagination mb-0">
                                                        <li className={Current_Page === 1 ? "page-item disabled" : "page-item"}>
                                                            <span className="page-link Cursor_hover" onClick={() => Set_Current_Page(Current_Page - 1)}>Previous</span>
                                                        </li>
                                                        {
                                                            Array.from({ length: Total_Pages }, (_, index) =>
                                                                <li key={index} onClick={() => Set_Current_Page(index + 1)} className={Current_Page === index + 1 ? "page-item active disabled" : "page-item Cursor_hover"}><a className="page-link">{index + 1}</a></li>
                                                            )
                                                        }
                                                        <li className={Current_Page === Total_Pages ? "page-item disabled" : "page-item"}>
                                                            <span className="page-link Cursor_hover" onClick={() => Set_Current_Page(Current_Page + 1)}>Next</span>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
            {CustomerToggle && <AddCustomerModal setToggle={setCustomerToggle} Reload={Fatch_Customer} />}
        </div>
    )
}

export default CustomerComponent
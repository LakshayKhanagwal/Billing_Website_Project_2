import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Title from "../../CommonComponents/Title"
import Footer from "../../CommonComponents/Footer"
import EditProductModal from './EditProductModal'
import AddProductModal from './AddProductModal'
const AllProductsComponent = () => {
    const [Product_Updated_Data, Set_Updated_Product_Data] = useState([])
    const [EditProductToggle, setEditProductToggle] = useState(false)
    const [Edit_Product, Set_EditProduct] = useState({})
    const [AddProductToggle, setAddProductToggle] = useState(false)
    const [Product_Count, Set_Product_Count] = useState({})
    const [Product_Data, Set_Product_Data] = useState([])
    const [Current_Page, Set_Current_Page] = useState(1)
    const [Total_Pages, Set_Total_Pages] = useState(0)
    const navigate = useNavigate()
    const Products_Per_Page = 10

    useEffect(() => {
        const Fatch_Users_Product_Helper = async () => {
            const User_Data = JSON.parse(localStorage.getItem("User_Data"))
            if (User_Data && User_Data.Authorization_Token) return await Fatch_Users_Product(User_Data.Authorization_Token)
            localStorage.clear()
            window.history.replaceState(null, null, "/")
            navigate("/", { replace: true })
        }
        Fatch_Users_Product_Helper()
    }, [])

    useEffect(() => {
        if (Product_Data.length !== 0) {
            const Last_Product_Index = Current_Page * Products_Per_Page
            const First_Product_Index = Last_Product_Index - Products_Per_Page
            const Current_VIsible_Products = Product_Data.slice(First_Product_Index, Last_Product_Index)
            const Total_Page_Count = Math.ceil(Product_Data.length / Products_Per_Page)

            Set_Product_Count({ First_Index: First_Product_Index + 1, Last_Index: Current_VIsible_Products.length + First_Product_Index, Total_Users: Product_Data.length })
            Set_Total_Pages(Total_Page_Count)
            Set_Updated_Product_Data(Current_VIsible_Products)
        }
    }, [Product_Data, Current_Page])

    const Fatch_Users_Product = async (token) => {
        try {
            const User_Products = await fetch("http://localhost:3100/Api/Get_Products", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
            const User_Products_JSON = await User_Products.json()
            // alert(User_Products_JSON?.Message)
            if (User_Products.status === 202) return Set_Product_Data(User_Products_JSON.All_Products)
            alert(User_Products_JSON?.Message)
        } catch (error) {
            console.log(error)
        }
    }

    const Edit = (Product) => {
        Set_EditProduct(Product)
        setEditProductToggle(!EditProductToggle)
    }

    const Delete_Product = async (Product) => {
        try {
            const User_Data = JSON.parse(localStorage.getItem("User_Data"))
            if (!User_Data || !User_Data.Authorization_Token) {
                localStorage.clear()
                window.history.replaceState(null, null, "/")
                navigate("/")
            }
            // eslint-disable-next-line no-restricted-globals
            if (confirm("Are you really wanna delete this product")) {
                console.log("object")
                const Product_Add_ACK = await fetch("http://localhost:3100/Api/Delete_Product/" + Product._id, {
                    method: "delete",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": User_Data.Authorization_Token
                    }
                })
                const Product_Add_ACK_JSON = await Product_Add_ACK.json()
                alert(Product_Add_ACK_JSON?.Message)
                if (Product_Add_ACK.status === 202) return Fatch_Users_Product(User_Data.Authorization_Token)
            } else {
            }
        } catch (error) {

        }
    }
    
    return (
        <div>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <Title Name="All Products" />
                        <div className="row pb-4 gy-3">
                            <div className="col-sm-4">
                                <button className="btn btn-primary addPayment-modal" onClick={() => setAddProductToggle(!AddProductToggle)} ><i className="las la-plus me-1" /> Add Products</button>
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
                                        <ul className="nav nav-tabs nav-tabs-custom nav-success mb-3" role="tablist">
                                            <li className="nav-item">
                                                <a className="nav-link active" data-bs-toggle="tab" href="#nav-border-top-all" role="tab" aria-selected="true">
                                                    Products
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="tab-content text-muted pt-2">
                                            <div className="tab-pane active" id="nav-border-top-all" role="tabpanel">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="table-responsive table-card">
                                                            <table className="table table-hover table-striped table-nowrap align-middle mb-0">
                                                                <thead className="table-light">
                                                                    <tr className="text-muted text-uppercase">
                                                                        <th scope="col" style={{ width: ".5%" }}>Sr. No.</th>
                                                                        <th scope="col" style={{ width: "15%" }}>Product Name-Model</th>
                                                                        <th scope="col" style={{ width: "5%" }}>Company</th>
                                                                        <th scope="col" style={{ width: "5%" }}>Price</th>
                                                                        <th scope="col" style={{ width: "5%" }}>Tax</th>
                                                                        <th scope="col" style={{ width: "5%" }}>Rate</th>
                                                                        <th scope="col" style={{ width: "5%" }}>Discount</th>
                                                                        <th scope="col" style={{ width: "5%" }}>Stock</th>
                                                                        <th scope="col" style={{ width: "5%" }}>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        Product_Updated_Data ? Product_Updated_Data?.map((Product, index) => {
                                                                            return (
                                                                                <tr>
                                                                                    <td>{Product_Count.First_Index + index}</td>
                                                                                    <td>
                                                                                        <a href="#javascript: void(0);" className="text-body align-middle fw-medium"> <b>{Product.name}</b>-<i>{Product.model}</i></a>
                                                                                    </td>
                                                                                    <td>{Product.company}</td>
                                                                                    <td>{Product.price}</td>
                                                                                    <td>{Product.tax}%</td>
                                                                                    <td>{Product.rate}</td>
                                                                                    <td>{Product.discount}%</td>
                                                                                    <td>{Product.stock}</td>
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
                                                                                                <li>
                                                                                                    <button onClick={() => Edit(Product)} className="dropdown-item" href="javascript:void(0);"><i className="las la-pen fs-18 align-middle me-2 text-muted" />
                                                                                                        Edit</button>
                                                                                                </li>
                                                                                                <li>
                                                                                                    <span onClick={() => Delete_Product(Product)} className="dropdown-item remove-item-btn Cursor_hover">
                                                                                                        <i className="las la-trash-alt fs-18 align-middle me-2 text-muted" />
                                                                                                        Delete
                                                                                                    </span>
                                                                                                </li>
                                                                                            </ul>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        }) : (
                                                                            <tr>
                                                                                <td colSpan={9}>Product List is Empty.</td>
                                                                            </tr>
                                                                        )
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
                                                <p className="mb-0 text-muted">Showing <b>{Product_Count?.First_Index}</b> to <b>{Product_Count?.Last_Index}</b> of <b>{Product_Count?.Total_Users}</b> results</p>
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
            {AddProductToggle && <AddProductModal setToggle={setAddProductToggle} addToggle={AddProductToggle} Fetch_Product={Fatch_Users_Product} />}
            {EditProductToggle && <AddProductModal Edit_Toggle={EditProductToggle} Set_Edit_Toggle={setEditProductToggle} Fetch_Product={Fatch_Users_Product} Product_Data={Edit_Product} />}
            {/* {EditProductToggle && <EditProductModal setToggle={setEditProductToggle} />} */}
        </div>
    )
}

export default AllProductsComponent
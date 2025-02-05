import React, { useEffect, useState } from 'react'
import Footer from '../../CommonComponents/Footer'
import Title from '../../CommonComponents/Title'

const ReviewExcelData = ({ Product_Excel }) => {
    const [Product_Data, Set_Product_Data] = useState([])
    const [Current_Page, Set_Current_Page] = useState(1)
    const [Total_Pages, Set_Total_Pages] = useState(0)
    const [Product_Count, Set_Product_Count] = useState({})
    const Products_Per_Page = 10

    useEffect(() => {
        if (Product_Excel.length !== 0) {
            const Last_Product_Index = Current_Page * Products_Per_Page
            const First_Product_Index = Last_Product_Index - Products_Per_Page
            const Current_VIsible_Products = Product_Excel.slice(First_Product_Index, Last_Product_Index)
            const Total_Page_Count = Math.ceil(Product_Excel.length / Products_Per_Page)

            Set_Product_Count({ First_Index: First_Product_Index + 1, Last_Index: Current_VIsible_Products.length + First_Product_Index, Total_Users: Product_Excel.length })
            Set_Total_Pages(Total_Page_Count)
            Set_Product_Data(Current_VIsible_Products)
        }
    }, [Product_Excel, Current_Page])
    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <Title Name={"Product List"} />
                    <div className="row pb-4 gy-3">
                        <div className="col-sm-4">
                            <a href="#" className="btn btn-primary addtax-modal"><i className="las la-plus me-1" /> Add Product</a>
                        </div>
                        <div className="col-sm-auto ms-auto">
                            <div className="d-flex gap-3">
                                <div className="search-box">
                                    <input type="text" className="form-control" id="searchMemberList" placeholder="Search for Result" />
                                    <i className="las la-search search-icon" />
                                </div>
                                <div>
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
                                    <div className="table-responsive table-card">

                                        <table className="table table-nowrap align-middle mb-0">
                                            <thead>
                                                <tr className="text-muted text-uppercase">
                                                    {/* <th style={{ width:"5%"}}>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" id="checkAll" defaultValue="option" />
                                                        </div>
                                                    </th> */}
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
                                                    Product_Data ? Product_Data?.map((Product, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                {/* <td>
                                                                    <div className="form-check">
                                                                        <input className="form-check-input" type="checkbox" id="check1" defaultValue="option" />
                                                                    </div>
                                                                </td> */}
                                                                <td className='text-center'>{Product_Count.First_Index + index}</td>
                                                                <td>{Product.name} - {Product.model}</td>
                                                                <td>{Product.company}</td>
                                                                <td>{Product.price}</td>
                                                                <td>{Product.tax}%</td>
                                                                <td><i className="mdi mdi-star text-warning" />{Product.rate}</td>
                                                                <td>{Product.discount}%</td>
                                                                <td>{Product.stock}</td>
                                                                <td>
                                                                    <div className="dropdown">
                                                                        <button className="btn btn-soft-secondary btn-sm dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                            <i className="las la-ellipsis-h align-middle fs-18" />
                                                                        </button>
                                                                        <ul className="dropdown-menu dropdown-menu-end">
                                                                            <li>
                                                                                <button className="dropdown-item"  ><i className="las la-eye fs-18 align-middle me-2 text-muted" />
                                                                                    View</button>
                                                                            </li>
                                                                            <li>
                                                                                <button className="dropdown-item"  ><i className="las la-pen fs-18 align-middle me-2 text-muted" />
                                                                                    Edit</button>
                                                                            </li>
                                                                            <li>
                                                                                <a className="dropdown-item"  ><i className="las la-file-download fs-18 align-middle me-2 text-muted" />
                                                                                    Download</a>
                                                                            </li>
                                                                            <li className="dropdown-divider" />
                                                                            <li>
                                                                                <a className="dropdown-item remove-item-btn" href="#">
                                                                                    <i className="las la-trash-  fs-18 align-middle me-2 text-muted" />
                                                                                    Delete
                                                                                </a>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }) : (
                                                        <tr>
                                                            <td colSpan={9}>No Product Found.</td>
                                                        </tr>
                                                    )
                                                }

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="row align-items-center mb-2 gy-3">
                                <div className="col-md-5">
                                    <p className="mb-0 text-muted">Showing <b>{Product_Count?.First_Index}</b> to <b>{Product_Count?.Last_Index}</b> of <b>{Product_Count?.Total_Users}</b> results</p>
                                </div>
                                <div className="hstack gap-2 col-md-3 align-items-start" >
                                    <button type="submit" className="btn btn-primary">Save</button>
                                    <button type="button" className="btn btn-light btn-outline-danger">Discard</button>
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
            <Footer />
        </div>
    )
}

export default ReviewExcelData

import React, { useEffect, useRef, useState } from 'react'
import Footer from '../../CommonComponents/Footer'
import Title from '../../CommonComponents/Title'
import { useNavigate } from 'react-router-dom'
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

const InvoiceDetails = ({ Invoice, Set_Invoice }) => {
    const navigate = useNavigate()
    const Download_Componant = useRef()
    const [Loading, Set_Loading] = useState(false)
    const [Customer, Set_Customer] = useState({})
    const [Shopkeper, Set_Shopkeper] = useState({})

    useEffect(() => {
        const Invoice_Details = async () => {
            try {
                const User_Data = JSON.parse(localStorage.getItem("User_Data"))
                if (!User_Data || !User_Data.Authorization_Token) {
                    localStorage.clear()
                    window.history.replaceState(null, null, "/")
                    navigate("/", { replace: true })
                }
                const Customer_ACK = await fetch("http://localhost:3100/Api/Data_For_Invoice_PDF", {
                    method: "post",
                    body: JSON.stringify({ id: Invoice?.Complete_Invoice?.customerId }),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": User_Data.Authorization_Token
                    }
                })
                const Customer_ACK_JSON = await Customer_ACK.json()
                // alert(Customer_ACK_JSON.Message, Customer_ACK)
                if (Customer_ACK.status === 202) return Set_Customer(Customer_ACK_JSON.Data.Customer_Data), Set_Shopkeper(Customer_ACK_JSON.Data.Shopkeeper)
            } catch (error) {
                console.log(error)
            }
        }
        Invoice_Details()
    }, [])

    const Download = async () => {
        try {
            Set_Loading(true)
            const Componant = Download_Componant.current

            html2canvas(Componant, { scale: 2 }).then((Componant_Canvas) => {
                const Canvas_To_Image_Converted = Componant_Canvas.toDataURL("image/png")
                const PDF = new jsPDF("p", "mm", "a4")
                const Canva_Width = 210
                const Canva_Height = (Componant_Canvas.height * Canva_Width) / Componant_Canvas.width
                PDF.addImage(Canvas_To_Image_Converted, "PNG", 0, 0, Canva_Width, Canva_Height)
                PDF.save("Invoice.pdf")
                Set_Invoice({})
            })
        } catch (error) {
            alert("Unable to Download Invoice. Try Again After Sometime.")
            Set_Loading(false)
        }
    }

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <Title Name={"Invoices Details"} />
                    <div className="row justify-content-center" ref={Download_Componant}>
                        <div className="col-xxl-9">
                            <div className="card" id="demo">
                                <div className="card-body">
                                    <div className="row p-4">
                                        <div className="col-lg-9">
                                            <h3 className="fw-bold mb-4">Invoice: {Customer?.name} </h3>
                                            <div className="row g-4">
                                                <div className="col-lg-6 col-6">
                                                    <p className="text-muted mb-1 text-uppercase fw-medium fs-14">Invoice No</p>
                                                    <h5 className="fs-16 mb-0">#<span id="invoice-no">{Invoice?.Complete_Invoice?.InvoiceNo}</span></h5>
                                                </div>
                                                <div className="col-lg-6 col-6">
                                                    <p className="text-muted mb-1 text-uppercase fw-medium fs-14">Date</p>
                                                    <h5 className="fs-16 mb-0"><span id="invoice-date">{Invoice?.Complete_Invoice?.createdAt ? new Date(Invoice?.Complete_Invoice?.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: "short", year: "numeric" }) : "-"}</span> <small className="text-muted" id="invoice-time">{Invoice?.Complete_Invoice?.createdAt ? new Date(Invoice?.Complete_Invoice?.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }) : "-"}</small></h5>
                                                </div>
                                                <div className="col-lg-6 col-6">
                                                    <p className="text-muted mb-1 text-uppercase fw-medium fs-14">Payment Status</p>
                                                    <span className="badge bg-success-subtle text-success fs-11" id="payment-status">Paid</span>
                                                </div>
                                                <div className="col-lg-6 col-6">
                                                    <p className="text-muted mb-1 text-uppercase fw-medium fs-14">Total Amount</p>
                                                    <h5 className="fs-16 mb-0">₹<span id="total-amount">{Invoice?.Complete_Invoice?.TotalAmount}/-</span></h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="mt-sm-0 mt-3">
                                                <div className="mb-4">
                                                    <img src="assets/images/logo-dark.png" className="card-logo card-logo-dark" alt="logo dark" height={17} />
                                                    <img src="assets/images/logo-light.png" className="card-logo card-logo-light" alt="logo light" height={17} />
                                                </div>
                                                <h6 className="text-muted text-uppercase fw-semibold">Address</h6>
                                                <p className="text-muted mb-1" id="address-details">{Shopkeper?.name}</p>
                                                <p className="text-muted mb-1" id="zip-code"><span>{Shopkeper?.address}</span></p>
                                                {/* <h6><span className="text-muted fw-normal">Email:</span><span id="email"></span></h6> */}
                                                <h6><span className="text-muted fw-normal">Email:</span> <a href="https://themesbrand.com/" className="link-primary" target="_blank" id="website">{Shopkeper?.email}</a></h6>
                                                <h6 className="mb-0"><span className="text-muted fw-normal">Contact No: </span><span id="contact-no"> +(91) {Shopkeper?.phone}</span></h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row p-4 border-top border-top-dashed">
                                        <div className="col-lg-9">
                                            <div className="row g-3">
                                                <div className="col-6">
                                                    <h6 className="text-muted text-uppercase fw-semibold mb-3">Billing Address</h6>
                                                    <p className="fw-medium mb-2" id="billing-name">{Customer?.name}</p>
                                                    <p className="text-muted mb-1" id="billing-address-line-1">{Customer?.address}</p>
                                                    <p className="text-muted mb-1"><span>Phone: +</span><span id="billing-phone-no">+(91) {Customer?.phone}</span></p>
                                                    {/* <p className="text-muted mb-0"><span>Tax: </span><span id="billing-tax-no">12-3456789</span> </p> */}
                                                </div>
                                                {/* <div className="col-6">
                                                    <h6 className="text-muted text-uppercase fw-semibold mb-3">Shipping Address</h6>
                                                    <p className="fw-medium mb-2" id="shipping-name">David Nichols</p>
                                                    <p className="text-muted mb-1" id="shipping-address-line-1">305 S San Gabriel Blvd</p>
                                                    <p className="text-muted mb-1"><span>Phone: +</span><span id="shipping-phone-no">(123) 456-7890</span></p>
                                                </div> */}
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <h6 className="text-muted text-uppercase fw-semibold mb-3">Total Amount</h6>
                                            <h3 className="fw-bold mb-2">₹{Invoice?.Complete_Invoice?.TotalAmount}/-</h3>
                                            <span className="badge bg-success-subtle text-success fs-12">Due Date: 23 Des, 2022</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="card-body p-4">
                                                <div className="table-responsive">
                                                    <table className="table table-borderless text-center table-nowrap align-middle mb-0">
                                                        <thead>
                                                            <tr className="table-active">
                                                                <th scope="col" style={{ width: 50 }}>#</th>
                                                                <th scope="col">Product Details</th>
                                                                <th scope="col">Price</th>
                                                                <th scope="col">Quantity</th>
                                                                <th scope="col">Tax</th>
                                                                <th scope="col">Discount</th>
                                                                <th scope="col" className="text-end">Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody id="products-list">
                                                            {
                                                                Invoice?.Final_Ordered_Items.map((Products, index) => {
                                                                    return (
                                                                        <tr>
                                                                            <th scope="row">{index + 1}</th>
                                                                            <td className="text-start">
                                                                                <span className="fw-medium">{Products.name}</span>
                                                                                <p className="text-muted mb-0">{Products.description}</p>
                                                                            </td>
                                                                            <td>₹{Products.price}/-</td>
                                                                            <td>{Products.quantity}</td>
                                                                            <td>{Products.tax}%</td>
                                                                            <td>{Products.discount}%</td>
                                                                            <td className="text-end">₹{Products.subtotal}/-</td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }

                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="border-top border-top-dashed mt-2">
                                                    <table className="table table-borderless table-nowrap align-middle mb-0 ms-auto" style={{ width: 250 }}>
                                                        <tbody>
                                                            <tr>
                                                                <td>Sub Total</td>
                                                                <td className="text-end">₹{Invoice?.Complete_Invoice?.Subtotal}/-</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Estimated Tax</td>
                                                                <td className="text-end">₹{Invoice?.Complete_Invoice?.TotalTax}/-</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Discount</td>
                                                                <td className="text-end">- ₹{Invoice?.Complete_Invoice?.TotalDiscount}/-</td>
                                                            </tr>
                                                            <tr className="border-top border-top-dashed fs-15">
                                                                <th scope="row">Total Amount</th>
                                                                <th className="text-end">₹{Invoice?.Complete_Invoice?.TotalAmount}/-</th>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="mt-3">
                                                    <h6 className="text-muted text-uppercase fw-semibold mb-3">panding balance:</h6>
                                                    <p className="text-muted">Total Amount: <span className="fw-medium">₹ </span><span id="card-total-amount">{Customer?.balance + Invoice?.Complete_Invoice?.TotalAmount}/-</span></p>
                                                </div>
                                                <div className="mt-4">
                                                    <div className="alert alert-info">
                                                        <p className="mb-0"><span className="fw-semibold">NOTES:</span>
                                                            <span id="note">All accounts are to be paid within 7 days from receipt of invoice. To be paid by cheque or
                                                                credit card or direct payment online. If account is not paid within 7
                                                                days the credits details supplied as confirmation of work undertaken
                                                                will be charged the agreed quoted fee noted above.
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                                                    <button className="btn btn-info" disabled={Loading}><i className="ri-printer-line align-bottom me-1" /> Print</button>
                                                    <button className="btn btn-primary" disabled={Loading} onClick={Download}><i className="ri-download-2-line align-bottom me-1" /> Download</button>
                                                </div>
                                            </div>
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
    )
}

export default InvoiceDetails

import React, { useEffect, useState } from 'react'
import Title from '../../CommonComponents/Title'
import Footer from '../../CommonComponents/Footer'
import InvoiceAddCustomerModal from './InvoiceAddCustomerModal'
import InvoiceAddItemModal from './InvoiceAddItemModal'
import { useNavigate } from 'react-router-dom'

const NewInvoice = (props) => {
    const [Customer_Toggle, Set_Customer_Toggle] = useState(false)
    const [Customer_Details, Set_Customer_Details] = useState({})
    const [Item_Toggle, Set_Item_Toggle] = useState(false)
    const [Product_Selected, Set_Product_Selected] = useState([])
    const [Price_Details, Set_Price_Details] = useState({})
    const [Loading, Set_Loading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (Product_Selected.length !== 0) {
            let Sub_Total = 0
            let Tax_Total = 0
            let Discount_Total = 0

            Product_Selected?.map(async (Product) => {
                Discount_Total += parseFloat((Product.quantity * ((Product.price * Product.discount) / 100)).toFixed(2))
                Tax_Total += parseFloat((Product.quantity * (((Product.price - ((Product.price * Product.discount) / 100)) * Product.tax) / 100)).toFixed(2))
                Sub_Total += parseFloat((Product.price* Product.quantity  ).toFixed(2))
            })
            const Amount_Total = parseFloat((Sub_Total + Tax_Total - Discount_Total).toFixed(2))
            return Set_Price_Details({ Amount_Total, Sub_Total, Tax_Total, Discount_Total })
        } else {
            return Set_Price_Details({})
        }
    }, [Product_Selected])

    const Remove_Items = (Product_Data) => {
        Set_Product_Selected(Product_Selected.filter(Product => Product._id !== Product_Data._id))
    }

    const Updated_Discount = (Updated_Discount_Value, Product_Data) => {
        Product_Data.discount = Updated_Discount_Value
        Set_Product_Selected(Product_Selected.filter(Product => Product._id === Product_Data._id ? Product_Data : Product))
    }

    const Add_Quantity = (Product_Data) => {
        Product_Data.quantity += 1
        Set_Product_Selected(Product_Selected.filter(Product => Product._id === Product_Data._id ? Product_Data : Product))
    }

    const Decrease_Quantity = (Product_Data) => {
        if (Product_Data.quantity > 1) {
            Product_Data.quantity -= 1
            Set_Product_Selected(Product_Selected.filter(Product => Product._id === Product_Data._id ? Product_Data : Product))
        } else {
            Set_Product_Selected(Product_Selected.filter(Product => Product._id !== Product_Data._id))
        }
    }
console.log(Product_Selected)
    const Save_Invoice = async (e) => {
        try {
            e.preventDefault()
            Set_Loading(true)
            const User_Data = JSON.parse(localStorage.getItem("User_Data"))
            if (!User_Data || !User_Data.Authorization_Token) {
                localStorage.clear()
                window.history.replaceState(null, null, "/")
                navigate("/", { replace: true })
            }
            if (!Customer_Details._id) return alert("Please Select Customer."), Set_Loading(false)
            if (Product_Selected.length === 0) return alert("Please Add Product First."), Set_Loading(false)

            const Updated_Product_Selected = Product_Selected.map(({ _id, stock, ...Product }) => ({ ...Product, id: _id }))
            console.log(Updated_Product_Selected)
            const Invoice_ACK = await fetch("http://localhost:3100/Api/Create_Invoice/" + Customer_Details._id, {
                method: "post",
                body: JSON.stringify({ Ordered_Items: Updated_Product_Selected }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": User_Data.Authorization_Token
                }
            })
            const Invoice_ACK_JSON = await Invoice_ACK.json()
            alert(Invoice_ACK_JSON.Message, Invoice_ACK)
            if (Invoice_ACK.status === 202) return props.Set_Invoice(Invoice_ACK_JSON.Data)
            Set_Loading(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <Title Name={"New Invoice"} />
                    <div className="row justify-content-center">
                        <div className="col-xxl-9">
                            <div className="card">
                                <form onSubmit={Save_Invoice} className="needs-validation" noValidate id="invoice_form">
                                    <div className="card-body border-bottom border-bottom-dashed p-4">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                {/* <div className="row g-3">
                                            <div className="col-lg-8 col-sm-6">
                                                <label htmlFor="invoicenoInput">Invoice No</label>
                                                <input type="text" className="form-control bg-light border-0" id="invoicenoInput" placeholder="Invoice No" defaultValue="#VL25000355" readOnly="readonly" />
                                            </div>
                                            <div className="col-lg-8 col-sm-6">
                                                <label htmlFor="choices-payment-status">Payment Status</label>
                                                <div className="input-light">
                                                    <select className="form-control bg-light border-0" data-choices data-choices-search-false id="choices-payment-status" required>
                                                        <option value>Select Payment Status</option>
                                                        <option value="Paid">Paid</option>
                                                        <option value="Unpaid">Unpaid</option>
                                                        <option value="Refund">Refund</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div> */}
                                                <button type='button' id="add-item" disabled={Loading} onClick={() => Set_Customer_Toggle(!Customer_Toggle)} className="btn btn-soft-secondary fw-medium"><i className="ri-add-fill me-1 align-bottom" /> {Customer_Details?.name ? "Change Customer" : "Add Customer"}</button>
                                            </div>
                                            <div className="col-lg-6 col-sm-6">
                                                <div><label htmlFor="billingName" className="text-muted text-uppercase fw-semibold">Billing Address</label></div>
                                                <div className="mb-2">
                                                    <input type="text" className="form-control bg-light border-0" id="billingName" placeholder="Full Name" value={Customer_Details?.name} disabled required />
                                                </div>
                                                <div className="mb-2">
                                                    <textarea className="form-control bg-light border-0" id="billingAddress" rows={3} placeholder="Address" value={Customer_Details?.address} disabled required />
                                                </div>
                                                <div className="mb-2">
                                                    <input type="text" className="form-control bg-light border-0" data-plugin="cleave-phone" id="billingPhoneno" placeholder="(+91) 9234536789" value={Customer_Details?.phone} disabled required />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body p-4">
                                        <div className="table-responsive">
                                            <table className="invoice-table table table-borderless table-nowrap mb-0">
                                                <thead className="align-middle">
                                                    <tr className="table-active">
                                                        <th scope="col" style={{ width: 50 }}>#</th>
                                                        <th scope="col">Product Details</th>
                                                        <th scope="col" style={{ width: 120 }}><div className="d-flex currency-select input-light align-items-center">Price(₹)</div></th>
                                                        <th scope="col" style={{ width: 120 }}>Quantity</th>
                                                        <th scope="col" style={{ width: 120 }}>Tax(%)</th>
                                                        <th scope="col" style={{ width: 120 }}>Discount(%)</th>
                                                        <th scope="col" className="text-end" style={{ width: 150 }}>Amount(₹)</th>
                                                        <th scope="col" className="text-end" style={{ width: 105 }} />
                                                    </tr>
                                                </thead>
                                                <tbody id="newlink">
                                                    {
                                                        Product_Selected && Product_Selected?.map((Product_Data, index) => {
                                                            return (<tr id={1} className="product">
                                                                <th scope="row" className="product-id">{index + 1}</th>
                                                                <td className="text-start">
                                                                    <div className="mb-2">
                                                                        <input type="text" className="form-control bg-light border-0" id="productName-1" placeholder="Product Name" readOnly value={`${Product_Data.name}-${Product_Data.model}`} required />
                                                                    </div>
                                                                    <textarea className="form-control bg-light border-0" id="productDetails-1" rows={2} placeholder="Product Details" readOnly value={Product_Data.description} defaultValue={""} />
                                                                </td>
                                                                <td>
                                                                    <input type="number" className="form-control product-price bg-light border-0" id="productRate-1" step="0.01" placeholder={0.00} readOnly value={Product_Data.price} required />
                                                                </td>
                                                                <td>
                                                                    <div className="input-step">
                                                                        <button type="button" className="minus" onClick={() => Decrease_Quantity(Product_Data)}>-</button>
                                                                        <input type="number" className="product-quantity" id="product-qty-1" defaultValue={0} readOnly value={Product_Data.quantity} />
                                                                        <button type="button" className="plus" onClick={() => Add_Quantity(Product_Data)}>+</button>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <input type="number" className="form-control product-price bg-light border-0" id="productRate-1" step="0.01" placeholder={0.00} readOnly value={Product_Data.tax} required />
                                                                </td>
                                                                <td>
                                                                    <input type="number" className="form-control product-price bg-light border-0" id="productRate-1" step="0.01" placeholder={0.00} onChange={(e) => Updated_Discount(e.target.value, Product_Data)} value={Product_Data.discount} required />
                                                                </td>
                                                                <td className="text-end">
                                                                    <div>
                                                                        <input type="text" className="form-control bg-light border-0 product-line-price" id="productPrice-1" placeholder="₹0.00" readOnly value={Product_Data.price * Product_Data.quantity} />
                                                                    </div>
                                                                </td>
                                                                <td className="product-removal">
                                                                    <a className="btn btn-success" disabled={Loading} onClick={() => Remove_Items(Product_Data)}>Delete</a>
                                                                </td>
                                                            </tr>)
                                                        })
                                                    }
                                                </tbody>
                                                <tbody>
                                                    <tr id="newForm" style={{ display: 'none' }}><td className="d-none" colSpan={5}><p>Add New Form</p></td></tr>
                                                    <tr>
                                                        <td colSpan={5}><button type='button' id="add-item" onClick={() => Set_Item_Toggle(!Item_Toggle)} className="btn btn-soft-secondary fw-medium"><i className="ri-add-fill me-1 align-bottom" /> Add Item</button></td>
                                                    </tr>
                                                    <tr className="border-top border-top-dashed mt-2">
                                                        <td colSpan={5} />
                                                        <td colSpan={3} className="p-0">
                                                            <table className="table table-borderless table-sm table-nowrap align-middle mb-0">
                                                                <tbody>
                                                                    <tr>
                                                                        <th scope="row">Sub Total</th>
                                                                        <td style={{ width: 150 }}><input type="text" className="form-control bg-light border-0" id="cart-subtotal" placeholder="₹0.00" value={Price_Details?.Sub_Total ? Price_Details.Sub_Total : ""} readOnly /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">Estimated Tax</th>
                                                                        <td><input type="text" className="form-control bg-light border-0" id="cart-tax" placeholder="₹0.00" value={Price_Details?.Tax_Total ? Price_Details?.Tax_Total : ""} readOnly /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">Discount</th>
                                                                        <td><input type="text" className="form-control bg-light border-0" id="cart-discount" placeholder="₹0.00" value={Price_Details?.Discount_Total ? Price_Details?.Discount_Total : ""} readOnly /></td>
                                                                    </tr>
                                                                    <tr className="border-top border-top-dashed">
                                                                        <th scope="row">Total Amount</th>
                                                                        <td><input type="text" className="form-control bg-light border-0" id="cart-total" placeholder="₹0.00" value={Price_Details?.Amount_Total ? Price_Details?.Amount_Total : ""} readOnly /></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor="exampleFormControlTextarea1" className="form-label text-muted text-uppercase fw-semibold">NOTES</label>
                                            <textarea className="form-control alert alert-info" id="exampleFormControlTextarea1" placeholder="Notes" rows={2} required defaultValue={"All accounts are to be paid within 7 days from receipt of invoice. To be paid by cheque or credit card or direct payment online. If account is not paid within 7 days the credits details supplied as confirmation of work undertaken will be charged the agreed quoted fee noted above."} />
                                        </div>
                                        <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                                            <button type="submit" disabled={Loading} className="btn btn-info"><i className="ri-printer-line align-bottom me-1" /> {Loading ? "Generating...." : "Save Invoice"}</button>
                                            <span className="btn btn-danger Cursor_hover" disabled={Loading} onClick={() => window.location.reload()}><i className="ri-send-plane-fill align-bottom me-1" />Discard</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            {Customer_Toggle && <InvoiceAddCustomerModal setToggle={Set_Customer_Toggle} Set_Customer={Set_Customer_Details} />}
            {Item_Toggle && <InvoiceAddItemModal setToggle={Set_Item_Toggle} Set_Product={Set_Product_Selected} Get_Product={Product_Selected} />}
        </div>
    )
}

export default NewInvoice
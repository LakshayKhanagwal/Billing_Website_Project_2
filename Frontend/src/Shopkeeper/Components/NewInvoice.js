import React, { useState } from 'react'
import Title from '../../CommonComponents/Title'
import Footer from '../../CommonComponents/Footer'
import InvoiceAddCustomerModal from './InvoiceAddCustomerModal'
import InvoiceAddItemModal from './InvoiceAddItemModal'

const NewInvoice = () => {
    const [Customer_Toggle, Set_Customer_Toggle] = useState(false)
    const [Customer_Details, Set_Customer_Details] = useState({})
    const [Item_Toggle, Set_Item_Toggle] = useState(false)

    const Product_Selected=[]
    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <Title Name={"New Invoice"} />
                    <div className="row justify-content-center">
                        <div className="col-xxl-9">
                            <div className="card">
                                <form className="needs-validation" noValidate id="invoice_form">
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
                                                <button type='button' id="add-item" onClick={() => Set_Customer_Toggle(!Customer_Toggle)} className="btn btn-soft-secondary fw-medium"><i className="ri-add-fill me-1 align-bottom" /> {Customer_Details?.name ? "Change Customer" : "Add Customer"}</button>
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
                                                        Product_Selected && Product_Selected.map((Product_Data, index) => {
                                                            <tr id={1} className="product">
                                                                <th scope="row" className="product-id">1</th>
                                                                <td className="text-start">
                                                                    <div className="mb-2">
                                                                        <input type="text" className="form-control bg-light border-0" id="productName-1" placeholder="Product Name" required />
                                                                        <div className="invalid-feedback">
                                                                            Please enter a product name
                                                                        </div>
                                                                    </div>
                                                                    <textarea className="form-control bg-light border-0" id="productDetails-1" rows={2} placeholder="Product Details" defaultValue={""} />
                                                                </td>
                                                                <td>
                                                                    <input type="number" className="form-control product-price bg-light border-0" id="productRate-1" step="0.01" placeholder={0.00} required />
                                                                    <div className="invalid-feedback">
                                                                        Please enter a rate
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="input-step">
                                                                        <button type="button" className="minus">-</button>
                                                                        <input type="number" className="product-quantity" id="product-qty-1" defaultValue={0} readOnly />
                                                                        <button type="button" className="plus">+</button>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <input type="number" className="form-control product-price bg-light border-0" id="productRate-1" step="0.01" placeholder={0.00} required />
                                                                    <div className="invalid-feedback">
                                                                        Please enter a rate
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <input type="number" className="form-control product-price bg-light border-0" id="productRate-1" step="0.01" placeholder={0.00} required />
                                                                    <div className="invalid-feedback">
                                                                        Please enter a rate
                                                                    </div>
                                                                </td>
                                                                <td className="text-end">
                                                                    <div>
                                                                        <input type="text" className="form-control bg-light border-0 product-line-price" id="productPrice-1" placeholder="$0.00" readOnly />
                                                                    </div>
                                                                </td>
                                                                <td className="product-removal">
                                                                    <a className="btn btn-success">Delete</a>
                                                                </td>
                                                            </tr>
                                                        })
                                                    }
                                                    {/* <tr id={1} className="product">
                                                        <th scope="row" className="product-id">1</th>
                                                        <td className="text-start">
                                                            <div className="mb-2">
                                                                <input type="text" className="form-control bg-light border-0" id="productName-1" placeholder="Product Name" required />
                                                                <div className="invalid-feedback">
                                                                    Please enter a product name
                                                                </div>
                                                            </div>
                                                            <textarea className="form-control bg-light border-0" id="productDetails-1" rows={2} placeholder="Product Details" defaultValue={""} />
                                                        </td>
                                                        <td>
                                                            <input type="number" className="form-control product-price bg-light border-0" id="productRate-1" step="0.01" placeholder={0.00} required />
                                                            <div className="invalid-feedback">
                                                                Please enter a rate
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="input-step">
                                                                <button type="button" className="minus">-</button>
                                                                <input type="number" className="product-quantity" id="product-qty-1" defaultValue={0} readOnly />
                                                                <button type="button" className="plus">+</button>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <input type="number" className="form-control product-price bg-light border-0" id="productRate-1" step="0.01" placeholder={0.00} required />
                                                            <div className="invalid-feedback">
                                                                Please enter a rate
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <input type="number" className="form-control product-price bg-light border-0" id="productRate-1" step="0.01" placeholder={0.00} required />
                                                            <div className="invalid-feedback">
                                                                Please enter a rate
                                                            </div>
                                                        </td>
                                                        <td className="text-end">
                                                            <div>
                                                                <input type="text" className="form-control bg-light border-0 product-line-price" id="productPrice-1" placeholder="$0.00" readOnly />
                                                            </div>
                                                        </td>
                                                        <td className="product-removal">
                                                            <a className="btn btn-success">Delete</a>
                                                        </td>
                                                    </tr> */}
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
                                                                        <td style={{ width: 150 }}><input type="text" className="form-control bg-light border-0" id="cart-subtotal" placeholder="$0.00" readOnly /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">Estimated Tax (15%)</th>
                                                                        <td><input type="text" className="form-control bg-light border-0" id="cart-tax" placeholder="$0.00" readOnly /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">Discount <small className="text-muted">(QuickBill-10%)</small></th>
                                                                        <td><input type="text" className="form-control bg-light border-0" id="cart-discount" placeholder="$0.00" readOnly /></td>
                                                                    </tr>
                                                                    <tr className="border-top border-top-dashed">
                                                                        <th scope="row">Total Amount</th>
                                                                        <td><input type="text" className="form-control bg-light border-0" id="cart-total" placeholder="$0.00" readOnly /></td>
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
                                            <button type="submit" className="btn btn-info"><i className="ri-printer-line align-bottom me-1" /> Save Invoice</button>
                                            <a className="btn btn-danger"><i className="ri-send-plane-fill align-bottom me-1" />Discard</a>
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
            {Item_Toggle && <InvoiceAddItemModal setToggle={Set_Item_Toggle} Set_Product={Product_Selected} />}
        </div>
    )
}

export default NewInvoice
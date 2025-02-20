import React from 'react'

const InvoiceAddItemModal = (props) => {
  return (
    <div>
        <div className="modal-backdrop fade show"></div>
        <div className="modal fade show" style={{ display: "block" }} id="addpaymentModal" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0">
                    <div className="modal-header p-4 pb-0">
                        <h5 className="modal-title" id="createMemberLabel">Search for product</h5>
                        <button type="button" onClick={() => props.setToggle(false)} className="btn-close" id="createMemberBtn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body p-4">
                            <div className="row">
                                <div className="col-lg-12">
                                    <form onSubmit={'/'} href="#" className="app-search me-2">
                                        <div className="position-relative">
                                            <input type="text" className="form-control custominputwidth" placeholder="Search..." autoComplete="off"/>
                                            <span className="las la-search search-widget-icon" />
                                            <span className="mdi mdi-close-circle search-widget-icon search-widget-icon-close d-none"/>
                                        </div>
                                    </form>
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

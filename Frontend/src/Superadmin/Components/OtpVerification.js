import React from 'react'

const OtpVerification = (props) => {

    console.log(props)

    const Verify_OTP = ()=>{

    }

    const set = ()=>{}
    return (
        <div>
            <div className="modal fade show" style={{ display: "block" }} id="addtaxModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0">
                        <div className="modal-header p-4 pb-0">
                            <h5 className="modal-title" id="createMemberLabel">Add Payment</h5>
                            <button onClick={() => props.fun(false)} type="button" className="btn-close" id="createMemberBtn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body p-4">
                            <form onSubmit={Verify_OTP}>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className='row'>
                                            <div className="mb-3 col-6">
                                                <label htmlFor="name" className="form-label">Name</label>
                                                <input type="text" className="form-control" onChange={set} name='name' placeholder="Enter Name" />
                                            </div>

                                            <div className="hstack gap-2 justify-content-end">
                                                <button type="button" onClick={() => props.fun(false)} className="btn btn-light" data-bs-dismiss="modal">Close</button>
                                                <button type="submit" className="btn btn-success" id="addNewMember">Add Taxes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop fade show"></div>
        </div>
    )
}

export default OtpVerification
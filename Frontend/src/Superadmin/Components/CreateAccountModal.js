import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateAccountModal = (props) => {
    const [OTP_Verification_Window, set_OTP_Verification_Window] = useState(false)
    const [Loading, Set_Loading] = useState(false)
    const [Password_eye, set_Password_eye] = useState(true)
    const [City_And_State, Set_City_And_State] = useState([])
    const [Shopkeepers, Set_Shopkeepers] = useState([])
    const nevigate = useNavigate()

    const [New_User_Data, Set_New_User_Data] = useState({})

    useEffect(() => {
        City_State()
    }, [])
    const set = (e) => Set_New_User_Data({ ...New_User_Data, [e.target.name]: e.target.value })

    const City_State = async () => {
        const City_State_Data = await fetch("https://api.allorigins.win/raw?url=https://city-state.netlify.app/index.json");
        const data = await City_State_Data.json()
        if (data) return Set_City_And_State(data)
    }

    useEffect(() => {
        const Fatch_Users_Helper = async () => {
            const User_Data = JSON.parse(localStorage.getItem("User_Data"))
            if (User_Data && User_Data.Authorization_Token) return await Fatch_Users(User_Data.Authorization_Token)
            localStorage.clear()
            window.history.replaceState(null, null, "/")
            nevigate("/", { replace: true })
        }
        Fatch_Users_Helper()
    }, [])

    const Fatch_Users = async (token) => {
        try {
            const Users = await fetch("http://localhost:3100/Api/Fatch_Shopkeepers_Executives", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
            const Users_All = await Users.json()
            if (Users.status === 202) return Set_Shopkeepers(Users_All.Data)
            alert(Users_All?.Message)
            console.log(Users_All?.Message)
        } catch (error) {
            console.log(error)
        }
    }

    const Create_Account = async (e) => {
        try {
            e.preventDefault()
            Set_Loading(true)

            const User_Data = JSON.parse(localStorage.getItem("User_Data"))
            if (!User_Data || !User_Data.Authorization_Token) {
                localStorage.clear()
                window.history.replaceState(null, null, "/")
                nevigate("/", { replace: true })
                console.log("first")
            }
            const Generate_OTP_ACK = await fetch("http://localhost:3100/Api/Shopkeeper_Verification", {
                method: "post",
                body: JSON.stringify(New_User_Data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": User_Data.Authorization_Token
                }
            })
            const OTP_ACK_JSON = await Generate_OTP_ACK.json()
            alert(OTP_ACK_JSON?.Message)
            if (Generate_OTP_ACK.status === 202) {
                set_OTP_Verification_Window(true)
                Set_Loading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const Verify_OTP = async (e) => {
        try {
            e.preventDefault()
            Set_Loading(true)

            const User_Data = JSON.parse(localStorage.getItem("User_Data"))
            if (!User_Data || !User_Data.Authorization_Token) {
                localStorage.clear()
                window.history.replaceState(null, null, "/")
                nevigate("/", { replace: true })
            }
            const OTP_Validity = await fetch("http://localhost:3100/Api/Shopkeper_OTP_Verification", {
                method: "post",
                body: JSON.stringify(New_User_Data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": User_Data.Authorization_Token
                }
            })
            const OTP_Validity_JSON = await OTP_Validity.json()
            alert(OTP_Validity_JSON?.Message)

            if (OTP_Validity.status === 201) return props.fun(false), props.All_Users(), Set_Loading(false);
            Set_Loading(false)
        } catch (error) {
            console.log(error)
        }
    }

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
                            {
                                OTP_Verification_Window ? (
                                    <form onSubmit={Verify_OTP}>
                                        <div className="col-lg-12">
                                            <div className='row'>
                                                <div className="mb-3 col-6">
                                                    <label htmlFor="otp" className="form-label">OTP</label>
                                                    <input type="number" className="form-control" onChange={set} name='OTP' placeholder="Enter OTP" />
                                                </div>
                                                <div className="hstack gap-2 justify-content-end">
                                                    <button type="button" onClick={() => props.fun(false)} className="btn btn-light" data-bs-dismiss="modal">Close</button>
                                                    <button type="submit" disabled={Loading} className="btn btn-success" id="addNewMember">{Loading ? "Verifying..." : "Verify"}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>

                                ) : (
                                    <form onSubmit={Create_Account}>
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className='row'>
                                                    <div className="mb-3 col-6">
                                                        <label htmlFor="name" className="form-label">Name</label>
                                                        <input type="text" className="form-control" onChange={set} name='name' placeholder="Enter Name" />
                                                    </div>
                                                    <div className="mb-3 col-6">
                                                        <label htmlFor="phone" className="form-label">Phone</label>
                                                        <input type="number" className="form-control" onChange={set} name='phone' placeholder="Enter Contact Number" />
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="address" className="form-label">Address</label>
                                                    <textarea type="text" className="form-control" onChange={set} name='address' placeholder="Enter Shop Address" />
                                                </div>
                                                <div className='row'>
                                                    <div className="mb-3 col-6">
                                                        <label htmlFor="email" className="form-label">Email</label>
                                                        <input type="mail" className="form-control" onChange={set} name='email' placeholder="Enter Email" />
                                                    </div>
                                                    <div className="mb-3 col-6">
                                                        <label htmlFor="password" className="form-label">Password</label>
                                                        <div className="position-relative auth-pass-inputgroup mb-3">
                                                            <input type={Password_eye && ("password")} name='password' onChange={set} className="form-control pe-5 password-input" placeholder="Enter password" />
                                                            <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" ><i className={Password_eye ? "las la-low-vision la-eye align-middle fs-18" : "las la-eye align-middle fs-18"} onClick={() => set_Password_eye(!Password_eye)} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-6">
                                                        <div className="mb-4">
                                                            <label htmlFor="state" className="form-label">State</label>
                                                            <select className="form-select" onChange={set} name="state" aria-label="Default select example">
                                                                <option selected value={"none"}>Select State</option>
                                                                {
                                                                    City_And_State && Object.keys(City_And_State).map((key, index) => {
                                                                        // console.log(key)
                                                                        return (<option key={index} value={key}>{key}</option>)
                                                                    })
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="mb-4">
                                                            <label htmlFor="city" className="form-label">City</label>
                                                            <select className="form-select" onChange={set} name='city' aria-label="Default select example">
                                                                <option selected value={"none"}>Select City</option>
                                                                {
                                                                    New_User_Data?.state && City_And_State[New_User_Data.state].map((city, index) => {
                                                                        return (<option key={index} value={city}>{city}</option>)
                                                                    })
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-4">
                                                        <div className="mb-4">
                                                            <label htmlFor="role" className="form-label">Role:</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-4">
                                                        <div className="mb-4">
                                                            <input type="radio" onChange={set} name='role' value={"shopkeeper"} />
                                                            <label style={{ marginLeft: "10px" }} htmlFor="country" className="form-label">Shopkeeper</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-4">
                                                        <div className="mb-4">
                                                            <input type="radio" onChange={set} name="role" value={"executive"} />
                                                            <label style={{ marginLeft: "10px" }} htmlFor="region" className="form-label">Executive</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                {New_User_Data?.role === "executive" && (<div className="mb-3">
                                                    <label htmlFor="shopkeeper_id" className="form-label">Shopkeeper ID's</label>
                                                    <select className="form-select" onChange={set} name='executiveof' aria-label="Default select example">
                                                        <option selected>Select Shopkeeper</option>
                                                        {
                                                            New_User_Data?.role === "executive" && Shopkeepers.map((Shop_keeper, index) => {
                                                                return (
                                                                    <option key={index} value={Shop_keeper._id}>{Shop_keeper.email}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>)}
                                                <div className="hstack gap-2 justify-content-end">
                                                    <button type="button" onClick={() => props.fun(false)} className="btn btn-light" data-bs-dismiss="modal">Close</button>
                                                    <button type="submit" disabled={Loading} className="btn btn-success" id="addNewMember">{Loading ? "Genearting..." : "Create Account"}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop fade show"></div>
        </div>
    )
}

export default CreateAccountModal
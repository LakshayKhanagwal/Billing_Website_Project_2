import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

const SignInComponent = () => {
    const [Password_eye, set_Password_eye] = useState(true)
    const [loading_boolen, set_loading_boolen] = useState(false)
    const [login_input_data, set_login_input_data] = useState({})
    const [Remember_me, set_Remember_me] = useState(false)
    const navigate = useNavigate()

    const set = (e) => set_login_input_data({ ...login_input_data, [e.target.name]: e.target.value })

    useEffect(() => {
        const Fatch_User_Details_Helper = async () => {
            const User_Data = JSON.parse(localStorage.getItem("User_Data"))
            if (User_Data && User_Data.Remember_me_boolen_state) return await Fatch_User_Details(User_Data.Authorization_Token)
        }
        Fatch_User_Details_Helper()
    }, [])

    const Fatch_User_Details = async (token) => {
        try {
            const User_Ckeck_ACK = await fetch("http://localhost:3100/Api/Fatch_User_Details", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
            const User_Ckeck_ACK_JSON = await User_Ckeck_ACK.json()
            // alert(User_Ckeck_ACK_JSON?.Message)
            if (User_Ckeck_ACK.status === 202) {
                localStorage.clear()
                console.log(User_Ckeck_ACK_JSON.Data.User_Token)
                localStorage.setItem("User_Data", JSON.stringify({ "Authorization_Token": User_Ckeck_ACK_JSON.Data.User_Token, "Remember_me_boolen_state": true }))
                window.history.replaceState(null, null, "/")
                navigate("/" + User_Ckeck_ACK_JSON?.Data?.role, { replace: true })
            } else {
                localStorage.clear()
            }
        } catch (error) {
            console.log(error)
        }
    }
    const login = async (e) => {
        try {
            e.preventDefault()
            set_loading_boolen(true)
            const User_ACK = await fetch("http://localhost:3100/Api/Login", {
                body: JSON.stringify(login_input_data),
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const User_ACK_JSON = await User_ACK.json()
            alert(User_ACK_JSON?.Message)

            if (User_ACK.status === 201) {
                localStorage.clear()
                console.log(User_ACK_JSON.Data.User_Token)
                localStorage.setItem("User_Data", JSON.stringify({ "Authorization_Token": User_ACK_JSON.Data.User_Token, "Remember_me_boolen_state": Remember_me }))
                navigate("/" + User_ACK_JSON.Data.role)
            }
        } catch (error) {
            alert("Something Went Wrong. Please Try Again.")
        } finally {
            set_loading_boolen(false)
        }
    }

    return (
        <div className="account-pages">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-11">
                        <div className="auth-full-page-content d-flex min-vh-100 py-sm-5 py-4 justify-content-center">
                            <div className="customcss">
                                <div className="d-flex flex-column h-100 py-0 py-xl-4">
                                    <div className="text-center mb-5">
                                        <a><span className="logo-lg"><img src="assets/images/logo-dark.png" height={21} /></span></a>
                                    </div>
                                    <div className="card my-auto ">
                                        <div className="col-lg-12">
                                            <div className="p-lg-5 p-4">
                                                <div className="text-center">
                                                    <h5 className="mb-0">Welcome Back!</h5>
                                                    <p className="text-muted mt-2">Sign in to continue to QuickBill.</p>
                                                </div>
                                                <div className="mt-4">
                                                    <form onSubmit={login} action="#" className="auth-input">
                                                        <div className="mb-3">
                                                            <label htmlFor="email" className="form-label">Email</label>
                                                            <input type="email" name='email' onChange={set} className="form-control" id="email" placeholder="Enter email" />
                                                        </div>
                                                        <div className="mb-2">
                                                            <label htmlFor="userpassword" className="form-label">Password</label>
                                                            <div className="position-relative auth-pass-inputgroup mb-3">
                                                                <input type={Password_eye && ("password")} name='password' onChange={set} className="form-control pe-5 password-input" placeholder="Enter password" />
                                                                <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" ><i className={Password_eye ? "las la-low-vision la-eye align-middle fs-18" : "las la-eye align-middle fs-18"} onClick={() => set_Password_eye(!Password_eye)} /></button>
                                                            </div>
                                                        </div>
                                                        <div className="form-check form-check-primary fs-16 py-2">
                                                            <input onClick={() => set_Remember_me(!Remember_me)} checked={Remember_me} className="form-check-input" type="checkbox" id="remember-check" />
                                                            <label className="form-check-label fs-14" htmlFor="remember-check">
                                                                Remember me
                                                            </label>
                                                        </div>
                                                        <div className="mt-2">
                                                            <button disabled={loading_boolen ? true : false} className="btn btn-primary w-100" type="submit">{loading_boolen ? "Loagging..." : "Log In"} </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 text-center">
                                        <p className="mb-0 text-muted">QuickBill. Crafted with <i className="mdi mdi-heart text-danger" /> by Lakshay Khanagwal</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SignInComponent
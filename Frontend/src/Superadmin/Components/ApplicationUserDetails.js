import React, { useEffect, useState } from 'react'
import Footer from '../../CommonComponents/Footer'
import Title from '../../CommonComponents/Title'
import CreateAccountModal from './CreateAccountModal'
import { useNavigate } from 'react-router-dom'

const ApplicationUserDetails = () => {
    const [Toggle, setToggle] = useState(false)
    const navigate = useNavigate()
    const [Shopkeepers_Executives, Set_Shopkeepers_Executives] = useState([])

    useEffect(() => {
        const Fatch_Users_Helper = async () => {
            const User_Data = JSON.parse(localStorage.getItem("User_Data"))
            if (User_Data && User_Data.Remember_me_boolen_state) return await Fatch_Users(User_Data.Authorization_Token)
        }
        Fatch_Users_Helper()
    }, [])

    const Fatch_Users = async (token) => {
        try {
            const Users = await fetch("http://localhost:3100/Api/Fatch_Shopkeepers_Executives", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
            const Users_All = await Users.json()
            alert(Users_All?.Message)
            if (Users.status === 202) {
                return Set_Shopkeepers_Executives(Users_All.Data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const Mark_Disable = async (id) => {
        try {
            const User_Data = JSON.parse(localStorage.getItem("User_Data"))
            if (!User_Data || !User_Data.Authorization_Token) {
                localStorage.clear();
                alert("Unauthorised user")
                window.history.replaceState(null, null, "/")
                return navigate("/", { replace: true })
            }
            const Users = await fetch("http://localhost:3100/Api/Disabler", {
                method: "put",
                body: id,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": User_Data.Authorization_Token
                }
            })
            const Users_Disable_ACK = await Users.json()
            console.log(Users_Disable_ACK)
            alert(Users_Disable_ACK?.Message)
            if (Users.status === 202) return Fatch_Users(User_Data.Authorization_Token)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='modal-open' >
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <Title Name={"Taxes"} />
                        <div className="row pb-4 gy-3">
                            <div className="col-sm-4">
                                <button onClick={() => setToggle(true)} className="btn btn-primary addtax-modal" ><i className="las la-plus me-1" /> Add Taxes</button>
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
                                            <table className="table table-hover table-nowrap align-middle mb-0">
                                                <thead>
                                                    <tr className="text-muted text-uppercase">
                                                        <th scope="col" style={{ width: '12%' }}>Name</th>
                                                        <th scope="col" style={{ width: '15%' }}>Phone</th>
                                                        <th scope="col" style={{ width: '20%' }}>Email</th>
                                                        <th scope="col" style={{ width: '15%' }}>Address</th>
                                                        <th scope="col" style={{ width: '13%' }}>City/State</th>
                                                        <th scope="col" style={{ width: '10%' }}>Service Status</th>
                                                        <th scope="col" style={{ width: '5%' }}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        Shopkeepers_Executives && Shopkeepers_Executives.length !== 0 ? Shopkeepers_Executives.map((user, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{user.name}</td>
                                                                    <td>{user.phone}</td>
                                                                    <td>{user.email}</td>
                                                                    <td>{user.address}</td>
                                                                    <td>{user.city}-{user.state}</td>
                                                                    <td>{user.service ? <span className="badge bg-success-subtle text-success p-2">Enabled</span> : <span className="badge bg-danger-subtle text-danger p-2">Disabled</span>}</td>
                                                                    <td>
                                                                        {user.service ? <div className="form-check form-switch">
                                                                            <input className="form-check-input" type="checkbox" checked={true} onChange={() => Mark_Disable(user._id)} role="switch" id="switch1" />
                                                                            <label className="form-check-label" htmlFor="switch1" />
                                                                        </div>
                                                                            : <div className="form-check form-switch">
                                                                                <input className="form-check-input" type="checkbox" checked={false} onChange={() => Mark_Disable(user._id)} role="switch" id="switch1" />
                                                                                <label className="form-check-label" htmlFor="switch1" />
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }) : <tr><td colSpan={7}>No User Found.</td></tr>
                                                    }
                                                    {/* <tr>
                                                        <td>Sales Tax</td>
                                                        <td>United States</td>
                                                        <td>(any)</td>
                                                        <td>10%</td>
                                                        <td>10%</td>
                                                        <td><span className="badge bg-success-subtle text-success  p-2">Enabled</span></td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" role="switch" id="switch1" />
                                                                <label className="form-check-label" htmlFor="switch1" />
                                                            </div>
                                                        </td>
                                                    </tr> */}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center mb-2 gy-3">
                                    <div className="col-md-5">
                                        <p className="mb-0 text-muted">Showing <b>1</b> to <b>5</b> of <b>10</b> results</p>
                                    </div>
                                    <div className="col-sm-auto ms-auto">
                                        <nav aria-label="...">
                                            <ul className="pagination mb-0">
                                                <li className="page-item disabled">
                                                    <span className="page-link">Previous</span>
                                                </li>
                                                <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                                <li className="page-item" aria-current="page">
                                                    <span className="page-link">2</span>
                                                </li>
                                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                                <li className="page-item">
                                                    <a className="page-link" href="#">Next</a>
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
            {Toggle && <CreateAccountModal fun={setToggle} />}
        </div>
    )
}

export default ApplicationUserDetails

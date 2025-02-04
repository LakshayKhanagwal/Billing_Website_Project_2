import React, { useEffect, useState } from 'react'
import Footer from '../../CommonComponents/Footer'
import Title from '../../CommonComponents/Title'
import CreateAccountModal from './CreateAccountModal'
import { useNavigate } from 'react-router-dom'

const ApplicationUserDetails = () => {
    const [Toggle, setToggle] = useState(false)
    const [Current_Page, Set_Current_Page] = useState(1)
    const [Total_Pages, Set_Total_Pages] = useState(0)
    const [Users_Divided, Set_Users_Divided] = useState(0)
    const [User_Count, Set_User_Count] = useState({})
    const Users_Per_Page = 4

    const navigate = useNavigate()
    const [Shopkeepers_Executives, Set_Shopkeepers_Executives] = useState([])

    useEffect(() => {
        const Fatch_Users_Helper = async () => {
            const User_Data = JSON.parse(localStorage.getItem("User_Data"))
            if (User_Data && User_Data.Authorization_Token) return await Fatch_Users(User_Data.Authorization_Token)
            localStorage.clear()
            window.history.replaceState(null, null, "/")
            navigate("/", { replace: true })
        }
        Fatch_Users_Helper()
    }, [])

    useEffect(() => {
        if (Shopkeepers_Executives.length !== 0) {
            const Last_User_Index = Current_Page * Users_Per_Page
            const First_User_Index = Last_User_Index - Users_Per_Page
            const Current_VIsible_Users = Shopkeepers_Executives.slice(First_User_Index, Last_User_Index)
            const Total_Page_Count = Math.ceil(Shopkeepers_Executives.length / Users_Per_Page)

            Set_User_Count({ First_Index: First_User_Index + 1, Last_Index: Current_VIsible_Users.length + First_User_Index, Total_Users: Shopkeepers_Executives.length })
            Set_Total_Pages(Total_Page_Count)
            Set_Users_Divided(Current_VIsible_Users)
        }
    }, [Shopkeepers_Executives, Current_Page])

    const Fatch_Users = async (token) => {
        try {
            const Users = await fetch("http://localhost:3100/Api/Fatch_Shopkeepers_Executives", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
            const Users_All = await Users.json()
            if (Users.status === 202) return Set_Shopkeepers_Executives(Users_All.Data)
            alert(Users_All?.Message)
        } catch (error) {
            console.log(error)
        }
    }

    const Mark_Enable = async (id) => {
        try {
            const User_Data = JSON.parse(localStorage.getItem("User_Data"))
            if (!User_Data || !User_Data.Authorization_Token) {
                localStorage.clear();
                alert("Unauthorised user")
                window.history.replaceState(null, null, "/")
                return navigate("/", { replace: true })
            }

            const Users = await fetch("http://localhost:3100/Api/Enabler", {
                method: "put",
                body: JSON.stringify({ id }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": User_Data.Authorization_Token
                }
            })
            const Users_Disable_ACK = await Users.json()
            if (Users.status === 202) return Fatch_Users(User_Data.Authorization_Token)
            alert(Users_Disable_ACK?.Message)
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
                body: JSON.stringify({ id }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": User_Data.Authorization_Token
                }
            })
            const Users_Disable_ACK = await Users.json()
            if (Users.status === 202) return Fatch_Users(User_Data.Authorization_Token)
            alert(Users_Disable_ACK?.Message)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='modal-open' >
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <Title Name={"Users"} />
                        <div className="row pb-4 gy-3">
                            <div className="col-sm-4">
                                <button onClick={() => setToggle(true)} className="btn btn-primary addtax-modal" ><i className="las la-plus me-1" /> Add User</button>
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
                                                        Users_Divided && Users_Divided.length !== 0 ? Users_Divided.map((user, index) => {
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
                                                                                <input className="form-check-input" type="checkbox" checked={false} onChange={() => Mark_Enable(user._id)} role="switch" id="switch1" />
                                                                                <label className="form-check-label" htmlFor="switch1" />
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }) : <tr><td colSpan={7}>No User Found.</td></tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center mb-2 gy-3">
                                    <div className="col-md-5">
                                        <p className="mb-0 text-muted">Showing <b>{User_Count?.First_Index}</b> to <b>{User_Count?.Last_Index}</b> of <b>{User_Count?.Total_Users}</b> results</p>
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
            {Toggle && <CreateAccountModal fun={setToggle} All_Users = {Fatch_Users} />}
        </div>
    )
}

export default ApplicationUserDetails

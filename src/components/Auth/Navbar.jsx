import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

export default function Navbar({ toggleSide }) {
	const user = auth.currentUser;
	const isAuthenticated = !!user;

	function goBack() {
		window.history.back();
	}

	const [click, setClick] = useState(false);
	const handleClick = () => setClick(!click);

	const handleLogout = async () => {
		try {
			await signOut(auth);
			window.location.href = "/";
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<div className="main-navbar d-flex align-items-center px-4 fixed-top" >

				{/*wrirk logo*/}
				<div className="d-flex align-items-center justify-content-between ps-3">
					<div onClick={handleClick}>
						<i className={click ? 'fas fa-times toggle-sidebar-btn d-xl-none mt-1 p-3 mb-2  text-white bg-secondary' : 'fas fa-bars toggle-sidebar-btn d-xl-none mt-1 mb-2 text-white bg-secondary p-3'}
							onClick={toggleSide} style={{ marginLeft: click ? '0' : '100px' }} ></i>
					</div>
				</div>
				{/*end wrirk logo*/}

				{/* navbar list */}
				<nav className="ms-auto">
					<ul className="d-flex align-items-center list-unstyled mb-0" style={{ fontFamily: "'Poppins', sans-seri" }}>

						{isAuthenticated &&
							(<>
								<li className="nav-item dropdown ">
									<Link className="nav-link p-2 dropdown-toggle bg-secondary text-white  rounded-circle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
										{user?.displayName?.charAt(0) || user?.email?.charAt(0)}
									</Link>
									<ul className="dropdown-menu">
										<li><Link className="dropdown-item" href="#">{user?.displayName || user?.email}</Link></li>
										<li><hr className="dropdown-divider" /></li>
										<li><Link className="dropdown-item" to="/readme">Help</Link></li>
										<li><button className="dropdown-item" onClick={() => handleLogout("redirect")}>Logout</button></li>
									</ul>
								</li>
							</>)
						}
					</ul>
				</nav>
				{/* end navbar list */}
			</div>
		</>
	)
}


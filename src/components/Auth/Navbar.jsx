import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMsal } from '@azure/msal-react';
import { useIsAuthenticated } from '@azure/msal-react';

export default function Navbar({toggleSide}) {
	const { instance, accounts } = useMsal();
	const isAuthenticated = useIsAuthenticated();
	
	function goBack() {
		window.history.back();
	}

	const [click, setClick] = useState(false);
	const handleClick = () => setClick(!click);

	const handleLogout = () => {
		instance.logoutRedirect({
			postLogoutRedirectUri: "/",
		});
	}

	return (
		<>
			<div className="main-navbar d-flex align-items-center px-4 fixed-top" >

				{/*wrirk logo*/}
				<div className="d-flex align-items-center justify-content-between ps-3">
					<div onClick={handleClick}>
						<i className={click ? 'fas fa-times toggle-sidebar-btn d-xl-none mt-1 p-3 mb-2  text-white bg-secondary' : 'fas fa-bars toggle-sidebar-btn d-xl-none mt-1 mb-2 text-white bg-secondary p-3'}
							onClick={toggleSide} style={{marginLeft: click ? '0':'100px'}} ></i>
					</div>
				</div>
				{/*end wrirk logo*/}

				{/* navbar list */}
				<nav className="ms-auto">
					<ul className="d-flex align-items-center list-unstyled mb-0" style={{ fontFamily: "'Poppins', sans-seri" }}>

						{isAuthenticated &&
							(<>
								<li class="nav-item dropdown ">
									<Link class="nav-link p-2 dropdown-toggle bg-secondary text-white  rounded-circle" href="#"  role="button" data-bs-toggle="dropdown" aria-expanded="false">
										{accounts[0].name.charAt(0)}
									</Link> 
									<ul class="dropdown-menu">
										<li><Link class="dropdown-item" href="#">{accounts[0].name}</Link></li>
										<li><hr class="dropdown-divider" /></li>
										<li><Link className="dropdown-item" to="/readme">Help</Link></li>
										<li><button class="dropdown-item" onClick={() => handleLogout("redirect")}>Logout</button></li>
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


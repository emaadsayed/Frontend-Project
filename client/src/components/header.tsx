import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Instagram from '../images/logo.png'
import profile from '../images/user_1144760.png'

export function Header() {
    const [userId, setUserId] = useState(localStorage.getItem("id"))
    const { user, isAuthenticated, isLoading } = useAuth0();

    const navigate = useNavigate()
    const location = useLocation();
    const { logout } = useAuth0();

    const handleLogout = () => {
        // Remove the user ID from local storage
        localStorage.removeItem("id");

        //handling auth0 logout and normal logout
        if (isAuthenticated) logout({ logoutParams: { returnTo: window.location.origin + '/signin' } })
        else navigate("/signin");
    };

    useEffect(() => {
        // If there's no user ID in local storage, redirect to the sign-up or sign-in page based on the current location
        if (!userId) {
            if (location.pathname == "/signup") navigate("/signup");
            else navigate("/signin");
        }
    }, [navigate]);

    return (
        <header className="h-16 bg-white border-b border-gray-primary mb-8">
            <div className="container mx-auto max-w-screen-lg h-full">
                <div className="flex justify-between h-full">
                    <div className="text-gray-700 text-center flex items-center align-items cursor-pointer">
                        <h1 className="flex justify-center w-full">
                            <Link to="/">
                                <img src={Instagram} className="mt-2 w-6/12" />
                            </Link>
                        </h1>
                    </div>
                    <div className="text-gray-700 text-center flex items-center align-items">
                        <Link to="/">
                            <svg
                                className="w-8 mr-6 text-black-light cursor-pointer"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                        </Link>
                        <div className="flex items-center cursor-pointer mr-5">
                            <Link to={`/profile/${userId}`}>
                                <img
                                    className="rounded-full h-8 w-8 flex"
                                    src={profile}
                                />
                            </Link>
                        </div>
                        <button
                            type="button"
                            title="Sign Out"
                            onClick={handleLogout}
                        >
                            <svg
                                className="w-8 mr-6 text-black-light cursor-pointer"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
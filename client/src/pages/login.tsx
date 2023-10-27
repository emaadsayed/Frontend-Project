import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Iphone from '../images/iphone-with-profile.jpg';
import Instagram from '../images/logo.png'
import { useMutation } from "@apollo/client";
import { SIGNIN, AUTH0_LOGIN } from "../graphql/mutation";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { loginWithRedirect } = useAuth0();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  const [signin,] = useMutation(SIGNIN);
  const [authLogin,] = useMutation(AUTH0_LOGIN);

  // Function to handle email/password login
  const handleLogin = () => {
    signin({
      variables: {
        email,
        password,
      },
    }).then((result) => {
      localStorage.setItem("id", result.data.loginUser.id);
      navigate("/");
    }).catch(error => {
      setError(error.message);
    })
  };

  // useEffect to set the document title and handle Auth0 login
  useEffect(() => {
    document.title = "Login - Instagram";

    // After the user has successfully logged in using Auth0, an API request is made to retrieve user data from the backend.
    if (isAuthenticated && user) {
      authLogin({
        variables: {
          email: user.email,
        },
      }).then((result) => {
        localStorage.setItem("id", result.data.auth0.id);
        navigate("/")
      }).catch(error => console.log(error.message))
    }
  }, [isAuthenticated]);

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen">
      <div className="flex w-3/5">
        <img
          src={Iphone}
        />
      </div>
      <div className="flex flex-col w-2/5">
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
          <h1 className="flex justify-center w-full">
            <img
              src={Instagram}
              className="mt-2 w-6/12 mb-4"
            />
          </h1>

          {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}

          <form >
            <input
              type="text"
              placeholder="Email address"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setEmail(target.value)}
              value={email}
            />
            <input
              type="password"
              placeholder="Password"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setPassword(target.value)}
              value={password}
            />
            <button
              type="button"
              onClick={handleLogin}
              className="bg-blue-medium text-white w-full rounded h-8 font-bold opacity-50"
            >
              Login
            </button>
            <p className="my-2 text-center font-semibold">Or</p>
            <button
              type="button"
              onClick={() => loginWithRedirect()}
              className="bg-blue-medium text-white w-full rounded h-8 font-bold opacity-50 mt-2"
            >
              Other Login Options
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
          <p className="text-sm">
            Don't have an account?{` `}
            <Link to="/signup" className="font-bold text-blue-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, type FormEvent } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { loginUser } from "../services/authservice";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await loginUser(email, password);

      localStorage.setItem("token", response.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: response.email,
          name: response.name,
        })
      );

      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      alert("Invalid Credentials");
    }
  };

    return (
      <div className="min-h-screen flex bg-gray-100">
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-500 items-center justify-center p-16 text-white">
          <div>
            <h1 className="text-6xl font-bold leading-tight mb-8">
              Smart Resume
              <br />
              ATS Platform
            </h1>

            <p className="text-2xl text-gray-200 leading-10">
              Analyze resumes instantly,
              rank candidates,
              identify missing skills,
              and streamline hiring.
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-10">
          <form
            onSubmit={handleLogin}
            className="bg-white w-full max-w-2xl p-14 rounded-2xl shadow-2xl border border-gray-200"
          >
            <div className="mb-10">
              <h1 className="text-5xl font-bold text-gray-800 mb-3">
                Welcome Back
              </h1>

              <p className="text-lg text-gray-500">
                Login to continue to your ATS dashboard
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full h-16 px-5 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-4 focus:ring-blue-200"
              />
            </div>

            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full h-16 px-5 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-4 focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              className="w-full h-16 bg-blue-700 hover:bg-blue-800 text-white text-xl font-bold rounded-md shadow-xl transition duration-300"
            >
              LOGIN
            </button>

            <p className="mt-8 text-center text-lg text-gray-600">
              Don’t have an account?

              <Link
                to="/register"
                className="text-blue-700 font-bold ml-2"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
  };

  export default Login;
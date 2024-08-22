import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import { AuthContext } from "../../providers/AuthProvider";
import SocialLogin from "../SocialLogin";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signIn, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then((result) => {
        const loggedUser = result.user;
        console.log(loggedUser);
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome back, ${loggedUser.displayName || loggedUser.email}!`,
        }).then(() => {
          navigate("/"); // Redirect to home page after showing the success message
        });
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.message,
        });
      });
  };

  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to home page if the user is already logged in
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-sm font-semibold text-gray-600"
              htmlFor="email"
            >
              Email
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              id="email"
              className="w-full px-3 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-semibold text-gray-600"
              htmlFor="password"
            >
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              id="password"
              className="w-full px-3 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
        <SocialLogin />
        <p className="mt-6 text-center text-gray-600">
          You have an account?{" "}
          <a href="/signup" className="text-green-500 hover:underline">
            Sign Up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

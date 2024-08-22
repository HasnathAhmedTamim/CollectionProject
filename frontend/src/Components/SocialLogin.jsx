import { useContext } from "react";

import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const SocialLogin = () => {
  const { googleSignIn } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await googleSignIn();
      const loggedUser = result.user;

      const userInfo = {
        name: loggedUser.displayName || "User",
        email: loggedUser.email || "No email",
        photoURL: loggedUser.photoURL || "",
        uid: loggedUser.uid,
        creationTime: loggedUser.metadata.creationTime,
        lastLoginAt: loggedUser.metadata.lastSignInTime,
        status: "active", // Set the default status to "active"
      };

      // Send user data to backend
      await axiosPublic.post("/users", userInfo);
      console.log(userInfo);
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome!",
      }).then(() => {
        navigate("/"); // Redirect to home page after showing the success message
      });
    } catch (error) {
      console.error("Error with Google Sign-In:", error);
      Swal.fire({
        icon: "error",
        title: "Google Sign-In Failed",
        text: error.message,
      });
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full py-2 mt-4 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
    >
      Sign in with Google
    </button>
  );
};

export default SocialLogin;

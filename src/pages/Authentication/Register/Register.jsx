import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import axios from "axios";
import useAxios from "../../../hooks/useAxios";

const Register = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { createUser, updateUserProile } = useAuth();
  const [profilePic, setProfilePic] = useState("");
  const axiosInstance = useAxios();
  const updateLastLogin = async (email) => {
    try {
      const res = await axiosInstance.patch(`/users/${email}/last-login`);
      console.log("Last login updated:", res.data);
    } catch (error) {
      console.error("Error updating last login:", error);
    }
  };
  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then(async (result) => {
        console.log(result.user);
        // update userinfo in the database
        const userInfo = {
          email: data.email,
          role: "user", //default role
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };
        const userRes = await axiosInstance.post("/users", userInfo);
        console.log(userRes.data);
        // ⬇️ Call updateLastLogin after user created and inserted
        await updateLastLogin(result.user.email);
        // update user profile in firebase
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic,
        };
        updateUserProile(userProfile)
          .then(() => {
            console.log("User name and pic updated");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    console.log(image);
    const formData = new FormData();
    formData.append("image", image);
    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;
    // save image data in imagebb
    const res = await axios.post(imageUploadUrl, formData);
    setProfilePic(res.data.data.url);
  };
  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Create an Account</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            {/* Name */}
            <label className="label">Your Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="input"
              placeholder="Your Name"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500">Name is required</p>
            )}
            {/* File */}
            <label className="label">Profile Image</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="input"
              placeholder="Your Profile Picture"
            />
            {/* Email */}
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input"
              placeholder="Email"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500">Email Address is required</p>
            )}
            {/* Password */}
            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", {
                required: true,
                // minLength: 6,
                pattern: /[A-Za-z\d]{4,}$/,
              })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500">Password is required</p>
            )}
            {/* {errors.password?.type === "minLength" && (
              <p className="text-red-500">Password should be 6 character</p>
            )} */}
            {errors.password?.type === "pattern" && (
              <p className="text-red-500">
                Password must be 8+ characters with uppercase, lowercase,
                number, and special character.
              </p>
            )}
            <button className="btn btn-primary text-accent mt-4">
              Register
            </button>
          </fieldset>
        </form>
        <p>
          <small>
            Already have an account?{" "}
            <Link to="/login" className="btn-link text-primary">
              Login
            </Link>
          </small>
        </p>
        <SocialLogin></SocialLogin>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";

const BeARider = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedRegion, setSelectedRegion] = useState("");
  const serviceCenters = useLoaderData();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const regions = [...new Set(serviceCenters.map((s) => s.region))];
  const districts = serviceCenters
    .filter((s) => s.region === selectedRegion)
    .map((s) => s.district);

  const onSubmit = async (data) => {
    const riderapplicationData = {
      name: user?.displayName,
      email: user?.email,
      ...data,
      status: "pending",
      create_At: new Date().toISOString(),
    };

    console.log("Submitting rider application:", riderapplicationData);
    try {
      const res = await axiosSecure.post("/riders", riderapplicationData);
        console.log("Application submitted successfully:", res.data.insertedId);
        if (res.data.insertedId) {
          Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Application Submitted",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      // Optionally reset form or show success toast
    } catch (error) {
      console.error("Failed to submit rider application:", error);
    }
    
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Be a Rider</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Name */}
        <div>
          <label className="label">Your Name</label>
          <input
            type="text"
            value={user?.displayName || ""}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        {/* Email */}
        <div>
          <label className="label">Your Email</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        {/* Age */}
        <div>
          <label className="label">Your Age</label>
          <input
            type="number"
            {...register("age", { required: "Age is required" })}
            placeholder="Your age"
            className="input input-bordered w-full"
          />
          {errors.age && (
            <span className="text-red-500">{errors.age.message}</span>
          )}
        </div>

        {/* Region */}
        <div>
          <label className="label">Region</label>
          <select
            {...register("region", { required: "Region is required" })}
            className="select select-bordered w-full"
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">Select region</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {errors.region && (
            <span className="text-red-500">{errors.region.message}</span>
          )}
        </div>

        {/* District */}
        <div>
          <label className="label">District</label>
          <select
            {...register("district", { required: "District is required" })}
            className="select select-bordered w-full"
          >
            <option value="">Select district</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          {errors.district && (
            <span className="text-red-500">{errors.district.message}</span>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="label">Phone Number</label>
          <input
            type="text"
            {...register("phone", { required: "Phone is required" })}
            placeholder="Contact number"
            className="input input-bordered w-full"
          />
          {errors.phone && (
            <span className="text-red-500">{errors.phone.message}</span>
          )}
        </div>

        {/* NID */}
        <div>
          <label className="label">NID Number</label>
          <input
            type="text"
            {...register("nid", { required: "NID is required" })}
            placeholder="NID number"
            className="input input-bordered w-full"
          />
          {errors.nid && (
            <span className="text-red-500">{errors.nid.message}</span>
          )}
        </div>

        {/* Bike Brand */}
        <div>
          <label className="label">Bike Brand</label>
          <input
            type="text"
            {...register("bikeBrand", { required: "Bike brand is required" })}
            placeholder="Bike brand"
            className="input input-bordered w-full"
          />
          {errors.bikeBrand && (
            <span className="text-red-500">{errors.bikeBrand.message}</span>
          )}
        </div>

        {/* Bike Registration Number */}
        <div>
          <label className="label">Bike Registration Number</label>
          <input
            type="text"
            {...register("bikeRegNo", {
              required: "Bike registration number is required",
            })}
            placeholder="Bike registration number"
            className="input input-bordered w-full"
          />
          {errors.bikeRegNo && (
            <span className="text-red-500">{errors.bikeRegNo.message}</span>
          )}
        </div>

        <button type="submit" className="btn btn-primary col-span-full mt-4">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default BeARider;

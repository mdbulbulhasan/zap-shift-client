import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import useAuth from "./../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const SendParcel = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const serviceData = useLoaderData();
  const regions = [...new Set(serviceData.map((item) => item.region))];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // Using watch instead of useState
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");
  const senderDistrict = watch("senderDistrict");
  const receiverDistrict = watch("receiverDistrict");

  const getDistrictsByRegion = (region) => {
    return serviceData
      .filter((item) => item.region === region)
      .map((item) => item.district);
  };

  const getCoveredAreasByDistrict = (district) => {
    const entry = serviceData.find((item) => item.district === district);
    return entry ? entry.covered_area : [];
  };

  const onSubmit = (data) => {
    const weight = parseFloat(data.weight || 0);
    const type = data.parcelType;
    const sameCity = data.senderRegion === data.receiverRegion;

    let baseCost = 0;
    let extraCost = 0;
    let breakdown = "";

    if (type === "document") {
      baseCost = sameCity ? 60 : 80;
      breakdown += `Parcel Type: Document\nBase Cost: ৳${baseCost}\n`;
    } else {
      if (weight <= 3) {
        baseCost = sameCity ? 110 : 150;
        breakdown += `Parcel Type: Non-Document\nWeight: ${weight}kg (≤3kg)\nBase Cost: ৳${baseCost}\n`;
      } else {
        const extraWeight = weight - 3;
        extraCost = extraWeight * 40;
        baseCost = sameCity ? 110 : 150 + 40;
        breakdown += `Parcel Type: Non-Document\nWeight: ${weight}kg (>3kg)\nBase Cost: ৳${baseCost}\nExtra Weight Cost: ৳${extraCost} (${extraWeight}kg x ৳40)\n`;
      }
    }

    const total = baseCost + extraCost;

    Swal.fire({
      title: "Confirm Booking",
      html: `
        <div style="text-align: left;">
          <pre>${breakdown}</pre>
          <h3 style="font-weight: bold;">Total Cost: ৳${total}</h3>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Proceed to Payment",
      cancelButtonText: "Go Back to Edit",
    }).then((result) => {
      if (result.isConfirmed) {
        proceedToPayment(data, total);
      }
    });
  };

  const proceedToPayment = (data, total) => {
    const createdAt = new Date().toISOString();
    const createdAtFormatted = new Date().toLocaleString("en-BD", {
      timeZone: "Asia/Dhaka",
      dateStyle: "medium",
      timeStyle: "short",
    });
    const randomPart = Math.random().toString(36).substr(2, 5).toUpperCase();
    const trackingId = `TRK-${Date.now()
      .toString(36)
      .toUpperCase()}-${randomPart}`;

    const parceldata = {
      ...data,
      delivery_cost: total,
      user_email: user?.email || "unknown",
      created_at: createdAt,
      created_at_formatted: createdAtFormatted,
      tracking_id: trackingId,
      status: "Created",
      payment_status: "Pending",
      payment_method: "Online Payment", // or "COD" if cash
    };

    console.log("Proceeding to payment with parcel data:", parceldata);

    // save data to the server
    axiosSecure.post("/parcels", parceldata).then((res) => {
      console.log(res.data);
      if (res.data.insertedId) {
        // TODO: ➡️ Add your payment redirect logic here
        Swal.fire({
          icon: "success",
          title: "Redirecting to Payment",
          text: "You will be redirected shortly...",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });

    // reset(); // clear form


  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">Add Parcel</h1>
      <hr className="my-4" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Parcel Info */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Enter Parcel Details</h2>
          <div className="flex gap-6 mb-6">
            <label className="flex gap-2">
              <input
                type="radio"
                value="document"
                {...register("parcelType", {
                  required: "Select a parcel type",
                })}
                className="radio radio-success"
              />{" "}
              Document
            </label>
            <label className="flex gap-2">
              <input
                type="radio"
                value="non-document"
                {...register("parcelType", {
                  required: "Select a parcel type",
                })}
                className="radio radio-success"
              />{" "}
              Non-Document
            </label>
          </div>
          {errors.parcelType && (
            <p className="text-red-500">{errors.parcelType.message}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("title", { required: "Parcel name is required" })}
              placeholder="Parcel Name"
              className="input input-bordered w-full"
            />
            {watch("parcelType") === "non-document" && (
              <input
                type="number"
                step="0.1"
                {...register("weight", {
                  required: "Weight is required for non-document parcels",
                })}
                placeholder="Parcel Weight (KG)"
                className="input input-bordered w-full"
              />
            )}
          </div>
        </div>

        {/* Sender Details */}
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Sender Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("senderName", { required: true })}
              placeholder="Sender Name"
              className="input input-bordered w-full"
            />
            <select
              {...register("senderRegion", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <input
              {...register("senderAddress", { required: true })}
              placeholder="Address"
              className="input input-bordered w-full"
            />
            <input
              {...register("senderContact", { required: true })}
              placeholder="Sender Contact No"
              className="input input-bordered w-full"
            />
            <select
              {...register("senderDistrict", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select District</option>
              {getDistrictsByRegion(senderRegion).map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            <select
              {...register("senderArea", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Covered Area</option>
              {getCoveredAreasByDistrict(senderDistrict).map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <textarea
              {...register("pickupInstruction", { required: true })}
              placeholder="Pickup Instruction"
              className="textarea textarea-bordered w-full md:col-span-2"
            ></textarea>
          </div>
        </div>

        {/* Receiver Details */}
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Receiver Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("receiverName", { required: true })}
              placeholder="Receiver Name"
              className="input input-bordered w-full"
            />
            <select
              {...register("receiverRegion", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <input
              {...register("receiverAddress", { required: true })}
              placeholder="Receiver Address"
              className="input input-bordered w-full"
            />
            <input
              {...register("receiverContact", { required: true })}
              placeholder="Receiver Contact No"
              className="input input-bordered w-full"
            />
            <select
              {...register("receiverDistrict", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select District</option>
              {getDistrictsByRegion(receiverRegion).map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            <select
              {...register("receiverArea", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Covered Area</option>
              {getCoveredAreasByDistrict(receiverDistrict).map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <textarea
              {...register("deliveryInstruction", { required: true })}
              placeholder="Delivery Instruction"
              className="textarea textarea-bordered w-full md:col-span-2"
            ></textarea>
          </div>
        </div>

        <p className="text-sm text-gray-500 italic mt-2">
          * PickUp Time 4pm–7pm Approx.
        </p>

        <div className="text-left mt-4">
          <button className="btn bg-lime-400 hover:bg-lime-500 text-black px-6">
            Proceed to Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;

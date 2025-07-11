import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["my-parcels", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  const handleView = (id) => {
    console.log("View Details:", id);
    // Implement view modal or navigation
  };

  const handlePay = (id) => {
    console.log("Pay Parcel:", id);
    // Implement payment logic
    navigate(`/dashboard/payment/${id}`);
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/parcels/${id}`);
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Your parcel has been deleted.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        } catch (err) {
          console.error(err);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the parcel.",
            icon: "error",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      }
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Title</th>
            <th>Created At</th>
            <th>Cost</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {parcels.map((parcel, index) => (
            <tr key={parcel._id}>
              <th>{index + 1}</th>

              {/* Type */}
              <td>
                {parcel.parcelType === "document" ? "Document" : "Non-Document"}
              </td>

              {/* Title */}
              <td>{parcel.title}</td>

              {/* Created At */}
              <td>{parcel.created_at_formatted}</td>

              {/* Cost */}
              <td>{parcel.delivery_cost}৳</td>

              {/* Payment Status */}
              <td>
                {parcel.payment_status.toLowerCase() === "paid" ? (
                  <span className="badge badge-success">Paid</span>
                ) : (
                  <span className="badge badge-error">Unpaid</span>
                )}
              </td>

              {/* Actions */}
              <td className="flex gap-2">
                <button
                  onClick={() => handleView(parcel._id)}
                  className="btn btn-sm btn-info"
                >
                  View
                </button>
                <button
                  onClick={() => handlePay(parcel._id)}
                  className="btn btn-sm btn-success"
                  disabled={parcel.payment_status.toLowerCase() === "paid"}
                >
                  {parcel.payment_status.toLowerCase() === "paid"
                    ? "Paid"
                    : "Pay"}
                </button>

                <button
                  onClick={() => handleDeleteClick(parcel._id)}
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyParcels;

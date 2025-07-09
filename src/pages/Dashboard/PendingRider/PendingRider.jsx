import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Dialog } from "@headlessui/react";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";

const PendingRider = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedRider, setSelectedRider] = useState(null);

  // Fetch pending riders
  const { data: pendingRiders = [], isLoading } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (riderId) =>
      axiosSecure.patch(`/riders/${riderId}`, { status: "Accepted" }),
    onSuccess: (_, riderId) => {
      queryClient.setQueryData(
        ["pendingRiders"],
        (oldData = []) => oldData.filter((rider) => rider._id !== riderId) // Remove from list instantly
      );
      Swal.fire("Approved!", "Rider has been approved.", "success");
    },
    onError: () => Swal.fire("Error", "Failed to approve rider.", "error"),
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: (riderId) =>
      axiosSecure.patch(`/riders/${riderId}`, { status: "Rejected" }),
    onSuccess: (_, riderId) => {
      queryClient.setQueryData(
        ["pendingRiders"],
        (oldData = []) => oldData.filter((rider) => rider._id !== riderId) // Remove from list instantly
      );
      Swal.fire("Rejected!", "Rider has been rejected.", "success");
    },
    onError: () => Swal.fire("Error", "Failed to reject rider.", "error"),
  });

  const handleApprove = (riderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to approve this rider?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        approveMutation.mutate(riderId);
      }
    });
  };

  const handleReject = (riderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to reject this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        rejectMutation.mutate(riderId);
      }
    });
  };

  if (isLoading) return <p>Loading pending riders...</p>;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Riders</h2>
      {pendingRiders.length === 0 ? (
        <p>No pending riders found.</p>
      ) : (
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>District</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRiders.map((rider) => (
              <tr key={rider._id}>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.region}</td>
                <td>{rider.district}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded ${
                      rider.status === "active"
                        ? "bg-green-200 text-green-800"
                        : rider.status === "rejected"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {rider.status}
                  </span>
                </td>
                <td className="space-x-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => setSelectedRider(rider)}
                  >
                    <FaEye /> View
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleApprove(rider._id)}
                    disabled={rider.status === "Accepted"}
                  >
                    <FaCheck /> Accept
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleReject(rider._id)}
                    disabled={rider.status === "rejected"}
                  >
                    <FaTimes /> Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for viewing rider details */}
      <Dialog
        open={!!selectedRider}
        onClose={() => setSelectedRider(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md bg-white rounded p-6 space-y-4">
            <Dialog.Title className="text-xl font-bold">
              Rider Details
            </Dialog.Title>
            {selectedRider && (
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {selectedRider.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedRider.email}
                </p>
                <p>
                  <strong>Age:</strong> {selectedRider.age}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedRider.phone}
                </p>
                <p>
                  <strong>Region:</strong> {selectedRider.region}
                </p>
                <p>
                  <strong>District:</strong> {selectedRider.district}
                </p>
                <p>
                  <strong>NID:</strong> {selectedRider.nid}
                </p>
                <p>
                  <strong>Bike Brand:</strong> {selectedRider.bikeBrand}
                </p>
                <p>
                  <strong>Bike Reg No:</strong> {selectedRider.bikeRegNo}
                </p>
                <p>
                  <strong>Status:</strong> {selectedRider.status}
                </p>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                className="btn btn-success"
                onClick={() => {
                  handleApprove(selectedRider._id);
                  setSelectedRider(null);
                }}
                disabled={selectedRider?.status === "active"}
              >
                <FaCheck /> Accept
              </button>
              <button
                className="btn btn-error"
                onClick={() => {
                  handleReject(selectedRider._id);
                  setSelectedRider(null);
                }}
                disabled={selectedRider?.status === "rejected"}
              >
                <FaTimes /> Reject
              </button>
              <button className="btn" onClick={() => setSelectedRider(null)}>
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default PendingRider;

import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";
import { format } from "date-fns";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });
  if (isPending) {
    return <Loading></Loading>;
  }
  return (
    <div className="overflow-x-auto">
      {payments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No payment history found.
        </div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Parcel Type</th>
              <th className="px-4 py-2 border">Parcel ID</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Transaction ID</th>
              <th className="px-4 py-2 border">Method</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment.transactionId} className="text-center">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{payment.parcelType}</td>
                <td className="px-4 py-2 border">{payment.parcelId}</td>
                <td className="px-4 py-2 border">${payment.amount}</td>
                <td className="px-4 py-2 border">{payment.transactionId}</td>
                <td className="px-4 py-2 border">{payment.paymentMethod}</td>
                <td className="px-4 py-2 border">
                  {payment.paymentDate_string
                    ? format(new Date(payment.paymentDate_string), "PPpp")
                    : "N/A"}
                </td>
                <td className="px-4 py-2 border">
                  <span
                    className={`px-2 py-1 rounded ${
                      payment.status === "success"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistory;

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading/Loading";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const [error, setError] = useState();

  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });
  if (isPending) {
    return <Loading></Loading>;
  }
  console.log(parcelInfo);
  const amount = parcelInfo.delivery_cost;
  const amountInCents = amount * 100;
  console.log(amountInCents);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }
    // Step-1: validate the card
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      setError(error.message);
    } else {
      setError("");
      console.log("payment method", paymentMethod);
      // step-2: Create Payment Intent
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        parcelId,
      });
      const clientSecret = res.data.clientSecret;
      // Step-3: Confirm Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      if (result.error) {
        console.error(result.error.message);
        setError(result.error);
      } else {
        setError("");
        // Payment Success Block
        if (result.paymentIntent.status === "succeeded") {
          console.log("Payment succeeded!");
          console.log(result);
          // Step-4: mark parcel paid also create payment history
          const paymentData = {
            parcelId,
            parcelType: parcelInfo.parcelType,
            email: user.email,
            amount,
            paymentMethod: result.paymentIntent.payment_method_types,
            transactionId: result.paymentIntent.id,
          };
          const paymentRes = await axiosSecure.post("/payments", paymentData);
          if (paymentRes.data.insertedId) {
            console.log("Payment Succesfull");
            // Show success SweetAlert with transaction id
            Swal.fire({
              title: "Payment Successful!",
              html: `Your payment was successful.<br>Transaction ID: <strong>${result.paymentIntent.id}</strong>`,
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              // Redirect to MyParcels page after user clicks OK
              navigate("/dashboard/myparcels");
            });
          }
        }
        // Payment Success Block
      }
      console.log("res from intent", res);
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md max-w-md mx-auto"
      >
        <CardElement className="p-2 border rounded"></CardElement>
        <button
          type="submit"
          className="btn btn-primary text-black w-full"
          disabled={!stripe}
        >
          Pay {amount} BDT
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;

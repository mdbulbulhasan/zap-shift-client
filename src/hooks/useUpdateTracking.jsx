import { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";

export const useUpdateTracking = () => {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const updateTracking = async ({ parcelId, trackId, status, note }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axiosSecure.post("/tracking/update", {
        parcelId,
        trackId,
        status,
        note,
      });
      setSuccess(res.data.insertedId);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      throw err;
    }
  };

  return { updateTracking, loading, error, success };
};

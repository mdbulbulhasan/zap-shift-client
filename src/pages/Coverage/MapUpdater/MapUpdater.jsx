// src/components/MapUpdater.jsx
import { useMap } from "react-leaflet";
import { useEffect } from "react";

const MapUpdater = ({ selectedDistrict }) => {
  const map = useMap();

  useEffect(() => {
    if (
      selectedDistrict &&
      typeof selectedDistrict.latitude === "number" &&
      typeof selectedDistrict.longitude === "number"
    ) {
      map.flyTo([selectedDistrict.latitude, selectedDistrict.longitude], 10, {
        duration: 2, // smooth animation
      });
    }
  }, [selectedDistrict, map]);
  

  return null;
};

export default MapUpdater;

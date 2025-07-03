// src/pages/Coverage.jsx
import { useState } from "react";
import SearchBox from "./SearchBox/SearchBox";
import DistrictMap from "./DistrictsMap/DistrictMap";

const Coverage = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">
        We are available in 64 districts.
      </h1>

      <SearchBox onSelect={setSelectedDistrict} />

      <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg border border-base-200">
        <DistrictMap selectedDistrict={selectedDistrict} />
      </div>
    </div>
  );
};

export default Coverage;

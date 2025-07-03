// src/components/SearchBox.jsx
import { useState } from "react";
import { useLoaderData } from "react-router";

const SearchBox = ({ onSelect }) => {
    const districtData = useLoaderData();
  const [query, setQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const handleSearch = (e) => {
    const input = e.target.value.toLowerCase();
    setQuery(input);

    const found = districtData.find((district) =>
      district.district.toLowerCase().includes(input)
    );
    setSelectedDistrict(found || null);
  };
  const handleGoClick = () => {
    if (selectedDistrict) {
      onSelect(selectedDistrict);
    }
  };
  return (
    <div className="flex gap-2 max-w-md mx-auto mb-6">
      <input
        type="text"
        placeholder="Search district name..."
        className="input input-bordered w-full"
        value={query}
        onChange={handleSearch}
      />
      <button
        onClick={handleGoClick}
        className="btn btn-primary"
        disabled={!selectedDistrict}
      >
        Go
      </button>
    </div>
  );
};

export default SearchBox;

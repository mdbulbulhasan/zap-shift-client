// src/components/DistrictMap.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import MapUpdater from "../MapUpdater/MapUpdater";
import { useLoaderData } from "react-router";


// Fix Leaflet default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DistrictMap = ({ selectedDistrict }) => {
    const districtData  = useLoaderData();
  return (
    <MapContainer
      center={[23.685, 90.3563]}
      zoom={7}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution="&copy; ZapShift"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {districtData.map((district, index) => {
        const position =
          typeof district.latitude === "number" &&
          typeof district.longitude === "number"
            ? [district.latitude, district.longitude]
            : [23.685, 90.3563]; // fallback to center of Bangladesh

        return (
          <Marker key={index} position={position}>
            <Popup>
              <div>
                <strong>{district.district || "Unknown District"}</strong>
                <br />
                <span>Region: {district.region || "Unknown"}</span>
                <br />
                <span>City: {district.city || "Unknown"}</span>
                <br />
                <span>
                  Areas:{" "}
                  {Array.isArray(district.covered_area)
                    ? district.covered_area.join(", ")
                    : "Not available"}
                </span>
                <br />
                {district.flowchart ? (
                  <img
                    src={district.flowchart}
                    alt={`${district.district || "District"} flowchart`}
                    className="w-32 mt-2"
                  />
                ) : (
                  <span>No flowchart available</span>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}

      <MapUpdater selectedDistrict={selectedDistrict} />
    </MapContainer>
  );
};

export default DistrictMap;

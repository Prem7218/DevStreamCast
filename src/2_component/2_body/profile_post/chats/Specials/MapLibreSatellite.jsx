import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const defaultPosition = [75.596, 20.682]; // Default [lng, lat]

const MapLibreSatellite = ({ location, onClose, setUploads, messageBox }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapStyle, setMapStyle] = useState("hybrid");
  const [marker, setMarker] = useState(null);

  // Parse initial lat/lng from props
  let lat = defaultPosition[1];
  let lng = defaultPosition[0];

  if (location) {
    const [parsedLat, parsedLng] = location.split(",").map(Number);
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      lat = parsedLat;
      lng = parsedLng;
    } else {
      console.error("Invalid coordinates received:", location);
    }
  }

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/${mapStyle}/style.json?key=${process.env.REACT_MAP_TILER}`,
      center: [lng, lat], // ✅ Correct format [lng, lat]
      zoom: 10,
    });

    mapRef.current = map;

    // ✅ Add Click Event to Capture User Clicks
    map.on("click", (e) => {
      const clickedLng = e.lngLat.lng;
      const clickedLat = e.lngLat.lat;

      // ✅ Ask for confirmation before setting location
      const confirmSave = window.confirm(
        `Do you want to save this location?\nLatitude: ${clickedLat}\nLongitude: ${clickedLng}`
      );

      if (confirmSave) {
        // Store the clicked location in state & parent
        setUploads((prev) => ({ ...prev, locationUpload: `${clickedLat},${clickedLng}` }));
        // ✅ Remove Old Marker
        if (marker) marker.remove();

        // ✅ Add New Marker
        const newMarker = new maplibregl.Marker({ color: "red" })
          .setLngLat([clickedLng, clickedLat])
          .addTo(map);

        setMarker(newMarker);
      }
    });

    return () => map.remove();
  }, [mapStyle]);

  return (
    <div className={`absolute  ${messageBox ? "w-[350px] h-[200px] top-[45%] right-0 " : "w-[600px] h-[400px] bottom-[10%] left-[30%]"} rounded-md shadow-md overflow-hidden`}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Controls */}
      <div className="absolute top-2 left-2 bg-white p-2 rounded-md shadow-md z-10">
        <label className="block mb-2 font-bold">🗺️ Choose Map View:</label>
        <select
          onChange={(e) => setMapStyle(e.target.value)}
          className="bg-gray-200 px-3 py-1 rounded-md cursor-pointer w-full"
        >
          <option value="satellite">🌍 Satellite</option>
          <option value="streets">🛣️ Streets</option>
          <option value="hybrid">🔀 Hybrid</option>
        </select>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md cursor-pointer"
      >
        ✖ Close
      </button>
    </div>
  );
};

export default MapLibreSatellite;

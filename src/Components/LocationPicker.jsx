import React, { useCallback, useRef, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
// import pinpoint from "../../assets/Icons/map-marker.png";
import pinpoint from "../assets/Images/map-marker.png";
 
const containerStyle = { width: "100%", height: "60dvh" };
const defaultCenter = { lat: 25.2048, lng: 55.2708 };
 
const LIBRARIES = ["places"];
 
const LocationPicker = ({ onLocationSelect }) => {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [selectAddress, setSelectAddress] = useState("");
  const [iconLoaded, setIconLoaded] = useState(false);
 
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCHCzEhfXXm0DC9rzNHBp0_za1FrNyCE5s",
    libraries: LIBRARIES,
  });
 
  const mapRef = useRef(null);
 
  const onLoad = useCallback((map) => {
    mapRef.current = map;
 
    // Preload the marker icon
    const img = new Image();
    img.src = pinpoint;
    img.onload = () => setIconLoaded(true);
    img.onerror = () => console.error("Failed to load marker icon image");
  }, []);
 
  const onIdle = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      const lat = center.lat();
      const lng = center.lng();
      setMapCenter({ lat, lng });
 
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          setSelectAddress(results[0].formatted_address);
          onLocationSelect({
            lat,
            lng,
            address: results[0].formatted_address,
          });
        }
      });
    }
  };
 
  if (!isLoaded) return <div>Loading map...</div>;
 
  return (
    <main>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={20}
        onLoad={onLoad}
        onIdle={onIdle}
        options={{ disableDefaultUI: true }}
      >
        {iconLoaded && (
          <Marker
            position={mapCenter}
            icon={{
              url: pinpoint,
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 40),
            }}
            animation={window.google.maps.Animation.DROP}
          />
        )}
      </GoogleMap>
    </main>
  );
};
 
export default LocationPicker;
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import pinpoint from "../assets/Images/map-marker.png";

const containerStyle = { width: "100%", height: "60dvh" };
const defaultCenter = { lat: 25.2048, lng: 55.2708 };
const LIBRARIES = ["places"];

const normalizeLatLng = (loc) => {
  if (!loc) return null;
  const lat = parseFloat(loc.lat);
  const lng = parseFloat(loc.lng);
  return isFinite(lat) && isFinite(lng) ? { lat, lng } : null;
};

const LocationPicker = ({ onLocationSelect, initialLocation,viewOnly = false }) => {
  const [mapCenter, setMapCenter] = useState(normalizeLatLng(initialLocation) || defaultCenter);
  const [selectAddress, setSelectAddress] = useState("");
  const [iconLoaded, setIconLoaded] = useState(false);

  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);
  const lastGeocodeRef = useRef({ lat: null, lng: null });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCHCzEhfXXm0DC9rzNHBp0_za1FrNyCE5s",
    libraries: LIBRARIES,
  });

  // set initial location if passed later
  useEffect(() => {
    if (initialLocation?.lat && initialLocation?.lng) {
  const normalized = normalizeLatLng(initialLocation);

      setMapCenter(normalized);
      lastGeocodeRef.current = normalized;
    }
  }, [initialLocation]);

  console.log('mp',mapCenter)

 const onLoad = useCallback((map) => {
  mapRef.current = map;
  map.panTo(mapCenter); 
  const img = new Image();
  img.src = pinpoint;
  img.onload = () => setIconLoaded(true);
  img.onerror = () => console.error("Failed to load marker icon image");
}, [mapCenter]);


  const onIdle = () => {
    if(viewOnly) return;
    if (!mapRef.current ) return;

    const center = mapRef.current.getCenter();
    const lat = center.lat();
    const lng = center.lng();

    // Only geocode if the location actually changed
    const prev = lastGeocodeRef.current;
    if (lat === prev.lat && lng === prev.lng) return;

    lastGeocodeRef.current = { lat, lng };
    setMapCenter({ lat, lng });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        setSelectAddress(address);
        onLocationSelect({ lat, lng, address });
      } else {
        setSelectAddress("");
        onLocationSelect({ lat, lng, address: "" });
      }
    });
  };

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address || place.name;

      setMapCenter({ lat, lng });
      lastGeocodeRef.current = { lat, lng };
      setSelectAddress(address);
      onLocationSelect({ lat, lng, address });

      mapRef.current?.panTo({ lat, lng });
    }
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="w-full">

      {!viewOnly &&
      <StandaloneSearchBox
        onLoad={(ref) => (searchBoxRef.current = ref)}
        onPlacesChanged={onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Search a place"
          className="w-full p-2 mb-2 border rounded"
        />
      </StandaloneSearchBox>
      }

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={18}
        onLoad={onLoad}
        onIdle={onIdle}
        // options={{
        //   streetViewControl: false,
        //   mapTypeControl: false,
        //   fullscreenControl: false,
        //   gestureHandling: 'none',
        // }}
      >
        {iconLoaded && (
          <Marker
            position={mapCenter}
            icon={{
              url: pinpoint,
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 40),
            }}
          />
        )}
      </GoogleMap>

      {selectAddress && (
        <p className="mt-2 text-sm text-gray-600">
          <strong>Selected Address:</strong> {selectAddress}
        </p>
      )}
    </div>
  );
};

export default LocationPicker;

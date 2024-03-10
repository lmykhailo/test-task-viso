import React, { useEffect, useRef } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import useMarkers from "../hooks/useMarkers";

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

const MapPage: React.FC = () => {
  const {
    mapCenter,
    markers,
    handleMapClick,
    handleMarkerDragEnd,
    handleDeleteMarker,
    resetMarkers,
  } = useMarkers();

  const mapRef = useRef<google.maps.Map>();
  const markerClustererRef = useRef<MarkerClusterer>();

  //UseEffect to create clusters on the map
  useEffect(() => {
    if (mapRef.current && markers.length) {
      if (markerClustererRef.current) {
        markerClustererRef.current.clearMarkers();
      }

      //Creating intial markers on the map
      const googleMarkers = markers.map((marker) => {
        const googleMarker = new google.maps.Marker({
          position: { lat: marker.location.lat, lng: marker.location.lng },
          label: marker.label,
          draggable: true,
        });

        //Functionality for dragging the marker
        googleMarker.addListener(
          "dragend",
          (event: google.maps.MapMouseEvent) => {
            handleMarkerDragEnd(marker.firebaseId, event);
          }
        );

        //Functionality for deleting the marker
        googleMarker.addListener("click", () => {
          handleDeleteMarker(marker);
        });

        return googleMarker;
      });

      //Creating clusters based on the current markers
      markerClustererRef.current = new MarkerClusterer({
        map: mapRef.current,
        markers: googleMarkers,
      });
    }
  }, [markers, handleDeleteMarker, handleMarkerDragEnd]);

  const onLoad = (mapInstance: google.maps.Map) => {
    mapRef.current = mapInstance;
  };

  //Clean-up function
  const handleResetMarkers = () => {
    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers();
    }
    resetMarkers();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={{
            height: "600px",
            width: "100%",
          }}
          zoom={10}
          center={mapCenter}
          onClick={handleMapClick}
          onLoad={onLoad}
        ></GoogleMap>
      </LoadScript>
      <button
        onClick={handleResetMarkers}
        style={{
          width: "30%",
          display: "flex",
          justifyContent: "center",
          margin: "auto",
        }}
      >
        Reset all markers
      </button>
    </div>
  );
};

export default MapPage;

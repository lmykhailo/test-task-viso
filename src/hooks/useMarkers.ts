import { useState } from "react";

interface IMarker {
  id: number;
  lat: number;
  lng: number;
  label: string;
  Timestamp: string;
}

const useMarkers = () => {
  const [markers, setMarkers] = useState<IMarker[]>([]);
  const [labelIndex, setLabelIndex] = useState(0);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({
    lat: 48.43681203298874,
    lng: 35.02467127834986,
  });

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newMarker = {
        id: markers.length + 1,
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        label: `${labelIndex + 1}`,
        Timestamp: new Date().toLocaleTimeString(),
      };
      setMarkers((markers) => [...markers, newMarker]);
      setMapCenter({ lat: newMarker.lat, lng: newMarker.lng });
      setLabelIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleMarkerDragEnd = (
    markerId: number,
    event: google.maps.MapMouseEvent
  ) => {
    const marker = markers.find((m) => m.id === markerId);
    if (marker) {
      const updatedMarker = {
        ...marker,
        lat: event.latLng?.lat() || 0,
        lng: event.latLng?.lng() || 0,
      };
      setMarkers((prevMarkers) =>
        prevMarkers.map((m) => (m.id === markerId ? updatedMarker : m))
      );
      setMapCenter({ lat: updatedMarker.lat, lng: updatedMarker.lng });
    }
  };

  const handleDeleteMarker = (marker: IMarker) => {
    setMarkers((markers) => markers.filter((m) => m !== marker));
    setLabelIndex((prevIndex) => prevIndex - 1);
  };

  const resetMarkers = () => {
    setMarkers([]);
    setLabelIndex(0);
  };

  return {
    mapCenter,
    markers,
    handleMapClick,
    handleMarkerDragEnd,
    handleDeleteMarker,
    resetMarkers,
  };
};

export default useMarkers;

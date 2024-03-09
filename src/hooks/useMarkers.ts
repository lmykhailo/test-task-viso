import { useState } from "react";
import { IQuestMarker } from "../types/IQuestMarker";

const useMarkers = () => {
  const [markers, setMarkers] = useState<IQuestMarker[]>([]);
  const [labelIndex, setLabelIndex] = useState(0);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({
    lat: 48.43681203298874,
    lng: 35.02467127834986,
  });

  console.log(markers);
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newQuestMarker = {
        id: `${markers.length + 1}`,
        location: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        },
        label: `${labelIndex + 1}`,
        nextQuestId: markers.length > 0 ? `${markers.length - 1}` : undefined,
      };
      setMarkers((markers) => [...markers, newQuestMarker]);
      setMapCenter({
        lat: newQuestMarker.location.lat,
        lng: newQuestMarker.location.lng,
      });
      setLabelIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleMarkerDragEnd = (
    markerId: string,
    event: google.maps.MapMouseEvent
  ) => {
    const marker = markers.find((m) => m.id === markerId);
    if (marker) {
      const updatedMarker = {
        ...marker,
        location: {
          lat: event.latLng?.lat() || 0,
          lng: event.latLng?.lng() || 0,
        },
      };
      setMarkers((prevMarkers) =>
        prevMarkers.map((m) => (m.id === markerId ? updatedMarker : m))
      );
      setMapCenter({
        lat: updatedMarker.location.lat,
        lng: updatedMarker.location.lng,
      });
    }
  };

  const handleDeleteMarker = (marker: IQuestMarker) => {
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

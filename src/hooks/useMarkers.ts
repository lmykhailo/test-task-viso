import { useEffect, useState } from "react";
import { IQuestMarker, IQuestMarkerFirebase } from "../types/IQuestMarker";
import useFirebase from "./useFirebase";
import { Timestamp } from "@firebase/firestore";

const useMarkers = () => {
  const { markers, postQuest, deleteQuest, updateQuest, deleteAllQuests } =
    useFirebase();

  const [labelIndex, setLabelIndex] = useState(0);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({
    lat: 48.43681203298874,
    lng: 35.02467127834986,
  });

  console.log(markers);
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newQuestMarker = {
        id: Timestamp.now().toMillis().toString(),
        location: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        },
        label: `${labelIndex + 1}`,
        nextQuestId: markers.length > 0 ? `${markers.length - 1}` : undefined,
      };

      if (newQuestMarker.nextQuestId === undefined) {
        delete newQuestMarker.nextQuestId;
      }

      postQuest(newQuestMarker);
      setMapCenter({
        lat: newQuestMarker.location.lat,
        lng: newQuestMarker.location.lng,
      });
      setLabelIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleMarkerDragEnd = (
    firebaseId: string,
    event: google.maps.MapMouseEvent
  ) => {
    const marker = markers.find((m) => m.firebaseId === firebaseId);
    if (marker) {
      const updatedMarker = {
        ...marker,
        location: {
          lat: event.latLng?.lat() || 0,
          lng: event.latLng?.lng() || 0,
        },
      };
      updateQuest(firebaseId, updatedMarker);
      setMapCenter({
        lat: updatedMarker.location.lat,
        lng: updatedMarker.location.lng,
      });
    }
  };

  const handleDeleteMarker = (marker: IQuestMarkerFirebase) => {
    deleteQuest(marker.firebaseId);
    setLabelIndex((prevIndex) => prevIndex - 1);
  };

  const resetMarkers = () => {
    deleteAllQuests();
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

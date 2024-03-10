import { useState } from "react";
import { IQuestMarkerFirebase } from "../types/IQuestMarker";
import useFirebase from "./useFirebase";
import { Timestamp } from "@firebase/firestore";

const useMarkers = () => {
  const { markers, postQuest, deleteQuest, updateQuest, deleteAllQuests } =
    useFirebase();

  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({
    lat: 48.43681203298874,
    lng: 35.02467127834986,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  //Creating a new instance of a marker
  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng && !isUpdating) {
      // To prevent race-condition in case user wants to click on the map multiple times while new marker is being created
      setIsUpdating(true);
      const newQuestMarker = {
        id: Timestamp.now().toMillis().toString(),
        location: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        },
        label: `${markers.length + 1}`,
      };

      const firebaseId = await postQuest(newQuestMarker);
      //logic to assign next quest id if it is present
      if (markers.length > 0) {
        const lastQuestMarker = markers[markers.length - 1];
        await updateQuest(lastQuestMarker.firebaseId, {
          ...lastQuestMarker,
          nextQuestId: firebaseId,
        });
      }

      //Changing the center of the map to the new marker
      setMapCenter(newQuestMarker.location);
      setIsUpdating(false);
    }
  };

  //Drag and drop function of a marker
  const handleMarkerDragEnd = async (
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
      await updateQuest(firebaseId, updatedMarker);
      //Changing the center of the map to the updated marker
      setMapCenter(updatedMarker.location);
    }
  };

  const handleDeleteMarker = async (marker: IQuestMarkerFirebase) => {
    await deleteQuest(marker.firebaseId);
  };

  const resetMarkers = () => {
    deleteAllQuests();
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

export interface IQuestMarker {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  label: string;
  nextQuestId?: string;
}

export interface IQuestMarkerFirebase extends IQuestMarker {
  firebaseId: string;
}

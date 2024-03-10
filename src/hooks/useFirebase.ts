import { useState, useEffect, useContext } from "react";
import { Context } from "..";
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { IQuestMarker, IQuestMarkerFirebase } from "../types/IQuestMarker";

const useFirebase = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("Context is not provided");
  }
  const { firestore } = context as { firestore: Firestore };

  const [markers, setMarkers] = useState<IQuestMarkerFirebase[]>([]);

  const fetchQuests = async () => {
    const querySnapshot = await getDocs(collection(firestore, "quests"));
    const questsArray: IQuestMarkerFirebase[] = [];
    querySnapshot.forEach((doc) => {
      questsArray.push({
        firebaseId: doc.id,
        ...doc.data(),
      } as IQuestMarkerFirebase);
    });
    setMarkers(questsArray);
  };

  const postQuest = async (quest: Omit<IQuestMarker, "id">) => {
    await addDoc(collection(firestore, "quests"), quest);
    fetchQuests();
  };

  const deleteQuest = async (id: string) => {
    await deleteDoc(doc(firestore, "quests", id));
    fetchQuests();
  };
  const deleteAllQuests = async () => {
    for (const marker of markers) {
      deleteQuest(marker.firebaseId);
    }
    fetchQuests();
  };

  const updateQuest = async (
    id: string,
    quest: Omit<IQuestMarkerFirebase, "id">
  ) => {
    try {
      const questDocRef = doc(firestore, "quests", id);
      await updateDoc(questDocRef, quest);
      fetchQuests();
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  return { markers, postQuest, deleteQuest, updateQuest, deleteAllQuests };
};

export default useFirebase;

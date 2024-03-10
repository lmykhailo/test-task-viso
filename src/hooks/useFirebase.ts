import { useState, useEffect, useContext, useCallback } from "react";
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

  const fetchQuests = useCallback(async () => {
    const querySnapshot = await getDocs(collection(firestore, "quests"));
    const questsArray: IQuestMarkerFirebase[] = [];
    querySnapshot.forEach((doc) => {
      questsArray.push({
        firebaseId: doc.id,
        ...doc.data(),
      } as IQuestMarkerFirebase);
    });
    setMarkers(questsArray);
  }, [firestore]);

  //Possible to create optimistic update for post, delete and update to remove the slight delay
  //but, I guess, it's not necessary for this task, also not very hard to implement in the future
  const postQuest = async (quest: Omit<IQuestMarker, "id">) => {
    const docRef = await addDoc(collection(firestore, "quests"), quest);
    fetchQuests();

    return docRef.id;
  };

  const deleteQuest = async (id: string) => {
    await deleteDoc(doc(firestore, "quests", id));
    fetchQuests();
  };

  const deleteAllQuests = async () => {
    const deletePromises = markers.map((marker) =>
      deleteDoc(doc(firestore, "quests", marker.firebaseId))
    );
    await Promise.all(deletePromises);
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

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
import { IQuestMarker } from "../types/IQuestMarker";

const useFirebase = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("Context is not provided");
  }
  const { firestore } = context as { firestore: Firestore };

  const [quests, setQuests] = useState<IQuestMarker[]>([]);

  const fetchQuests = async () => {
    const querySnapshot = await getDocs(collection(firestore, "quests"));
    const questsArray: IQuestMarker[] = [];
    querySnapshot.forEach((doc) => {
      questsArray.push({ id: doc.id, ...doc.data() } as IQuestMarker);
    });
    setQuests(questsArray);
  };

  const postQuest = async (quest: Omit<IQuestMarker, "id">) => {
    await addDoc(collection(firestore, "quests"), quest);
    fetchQuests();
  };

  const deleteQuest = async (id: string) => {
    await deleteDoc(doc(firestore, "quests", id));
    fetchQuests();
  };
  const updateQuest = async (id: string, quest: Omit<IQuestMarker, "id">) => {
    await updateDoc(doc(firestore, "quests", id), quest);
    fetchQuests();
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  return { quests, postQuest, deleteQuest, updateQuest };
};

export default useFirebase;

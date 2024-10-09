import { db } from "./firebase";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

const maxRoomSize = 4;

export const fetchRooms = async () => {
    const roomsRef = collection(db, "rooms");
    const roomSnapshots = await getDocs(roomsRef);
    const rooms = [];
    roomSnapshots.forEach((doc) => rooms.push({ id: doc.id, ...doc.data() }));
    return rooms;
};

export const joinRoom = async (userId) => {
    const rooms = await fetchRooms();

    for (const room of rooms) {
        if (room.members.length < maxRoomSize) {
            const roomRef = doc(db, "rooms", room.id);
            const updatedMembers = [...room.members, userId];
            await updateDoc(roomRef, { members: updatedMembers });
            return room.id;
        }
    }

    const newRoom = await addDoc(collection(db, "rooms"), {
        members: [userId],
    });
    return newRoom.id;
};

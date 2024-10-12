import { firestore } from '@/src/utils/firebase';

export async function POST(req) {
  const { userId } = await req.json();

  // Find or create a new room
  const roomsRef = firestore.collection('rooms');
  const snapshot = await roomsRef.where('isFull', '==', false).limit(1).get();

  if (!snapshot.empty) {
    const room = snapshot.docs[0];
    await room.ref.update({
      participants: [...room.data().participants, userId],
      isFull: room.data().participants.length + 1 === 2 // Example: max 2 participants per room
    });
    return new Response(JSON.stringify({ roomId: room.id }), { status: 200 });
  } else {
    const newRoom = await roomsRef.add({
      participants: [userId],
      isFull: false,
    });
    return new Response(JSON.stringify({ roomId: newRoom.id }), { status: 200 });
  }
}

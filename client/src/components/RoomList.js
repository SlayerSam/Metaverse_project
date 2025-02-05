import { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { fetchRoom, joinRoom } from './WebSocketClient';
import { setUser } from "@/redux/slices/userSlice";
import { useDispatch, useSelector } from 'react-redux';

export default function RoomList({ isList, setIsOpen, roomId }) {
    const { user } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        if (user)
            setTimeout(() => {
                fetchRoom(setRooms)
            }, 1000)
    }, [user])

    const handleJoinRoom = async (roomId) => {
        try {
            // Wait for the user to join the room
            await joinRoom(user.id, roomId, setIsOpen);

            // Create a shallow copy of the user object and update the roomId
            const updatedUser = { ...user, roomId };

            // Dispatch the updated user to the Redux store
            dispatch(setUser(updatedUser));
        } catch (error) {
            console.error('Error joining room:', error);
        }
    }
    if (roomId) {
        return (
            <div className='flex justify-center items-center'>
                {roomId.substring(0, 7)}
            </div>
        )
    }
    if (rooms.length > 0) {
        if (isList) {
            return (
                <ul className='w-full h-full bg-slate-400 flex flex-col justify-center'>
                    {rooms.map((room) => (
                        <li key={room?.id}>
                            {room?.id} - Users: {room?.users?.length}/{room?.capacity}
                        </li>
                    ))}
                </ul>
            )
        }

        return (
            <div className='w-full h-full flex justify-center items-center'>
                <DropdownMenu>
                    <DropdownMenuTrigger className='flex justify-center items-center'>Open</DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {rooms.map((room) => (
                            <DropdownMenuItem
                                key={room?.id}
                                onClick={() => handleJoinRoom(room.id)} // Call the async function to handle joining
                            >
                                {room?.id} - Users: {room?.users?.length}/{room?.capacity}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }

    return null;
}

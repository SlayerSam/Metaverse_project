// components/RoomList.js
import { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { fetchRoom, joinRoom } from './WebSocketClient';
import { useSelector } from 'react-redux';


export default function RoomList({ isList , setIsOpen }) {
    const { user } = useSelector((state) => state.user)
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        fetchRoom(setRooms)
    }, [rooms])
    if (rooms.length > 0) {
        if (isList) {
            return (
                <ul className='w-full h-full bg-slate-400 flex flex-col justify-center'>
                    {rooms.map((room) => (
                        <li key={room.id}>
                            {room.id} - Users: {room.users.length}/{room.capacity}
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
                            <DropdownMenuItem key={room.id} onClick={() => joinRoom(user.userId, room.id , setIsOpen)}>
                                {room.id} - Users: {room.users.length}/{room.capacity}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }
}
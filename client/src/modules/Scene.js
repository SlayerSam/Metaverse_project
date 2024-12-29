'use client';
import { Canvas } from '@react-three/fiber';
import { useRef, useState, Suspense, useEffect } from 'react';
import { Environment } from '@react-three/drei';
import ThirdPersonCamera from './Avatar/camera/ThirdPerson';
import FirstPersonCamera from './Avatar/camera/FirstPerson';
import SampleBase from './Base/SampleBase';
import { SampleBase2 } from './Base/SampleBase2';
import { Avatar } from './Avatar';
import { useSelector } from 'react-redux';
import { fetchRoom, getSocket, reConnectUser } from '@/components/WebSocketClient';
import { Character } from './Avatar/Character';
import * as THREE from 'three'

export default function Scene({ isOpen, isFirstPerson }) {
    const { user } = useSelector((state) => state.user);
    const avatarRef = useRef(); // Reference for the main avatar
    const [headNode, setHeadNode] = useState();
    const [isMoving, setIsMoving] = useState(false);
    const [BaseUrl, setBaseUrl] = useState(true);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        if (user) {
            reConnectUser(user.id, user.roomId)
            fetchRoom(setRooms);
        }
    }, [user]);

    return (
        <Canvas shadows>
            <Environment preset="park" />

            {isFirstPerson
                ? <FirstPersonCamera headNode={headNode} avatarRef={avatarRef} isMoving={isMoving} />
                : <ThirdPersonCamera avatarRef={avatarRef} isMoving={isMoving} />
            }

            <Suspense fallback={null}>
                {BaseUrl ? <SampleBase /> : <SampleBase2 />}
            </Suspense>

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 100]} />

            <Avatar
                group={avatarRef}
                setHeadNode={setHeadNode}
                isFirstPerson={isFirstPerson}
                setBaseUrl={setBaseUrl}
                setIsMoving={setIsMoving}
                isOpen={isOpen}
            />
            {rooms?.map((room, roomIndex) => {
                if (room.id == user?.roomId)
                    return (
                        <group key={roomIndex}>
                            {room.avatars?.map((userAvatar, userIndex) => {
                                if (userAvatar?.userId != user?.id) {
                                    return (
                                        <Suspense key={userIndex} fallback={null}>
                                            <Character
                                                id={userAvatar.userId}
                                                hairColor={userAvatar.hairColor}
                                                pantColor={userAvatar.pantColor}
                                                shirtColor={userAvatar.shirtColor}
                                                shoesColor={userAvatar.shoesColor}
                                                position={new THREE.Vector3(userAvatar.position.x, userAvatar.position.y, userAvatar.position.z)}
                                                isJumping={userAvatar.isJumping}
                                                isMoving={userAvatar.isMoving}
                                                rotation={userAvatar.rotation}
                                            />
                                        </Suspense>
                                    )
                                }
                            })}
                        </group>
                    )
            })}
        </Canvas>
    );
}

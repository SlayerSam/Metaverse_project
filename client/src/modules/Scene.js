'use client';
import { Canvas } from '@react-three/fiber';
import { useRef, useState, Suspense, useEffect } from 'react';
import { Billboard, Environment, Text } from '@react-three/drei';
import ThirdPersonCamera from './Avatar/camera/ThirdPerson';
import FirstPersonCamera from './Avatar/camera/FirstPerson';
import SampleBase from './Base/SampleBase';
import { SampleBase2 } from './Base/SampleBase2';
import { Avatar } from './Avatar';
import { useSelector } from 'react-redux';
import { fetchRoom, getSocket, reConnectUser } from '@/components/WebSocketClient';
import { Character } from './Avatar/Character';
import * as THREE from 'three'
import { generateQRCode } from '@/utils/qrcode.utils';
import QRPlane from '@/components/QRcode';

export default function Scene({ isOpen, isFirstPerson }) {
    const { user } = useSelector((state) => state.user);
    const avatarRef = useRef(); // Reference for the main avatar
    const [headNode, setHeadNode] = useState();
    const [isMoving, setIsMoving] = useState(false);
    const [BaseUrl, setBaseUrl] = useState(true);
    const [rooms, setRooms] = useState([]);
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        generateQRCode('https://1d35f0fb-3000.inc1.devtunnels.ms/display/123').then((url) => setQrCodeUrl(url));
    }, []);

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

            {qrCodeUrl && <QRPlane url={qrCodeUrl} />}

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 100]} />

            {rooms?.map((room, roomIndex) => (
                <>
                    {
                        room.id == user?.roomId && room.avatars?.map((userAvatar, userIndex) => {
                            if (userAvatar?.userId != user?.id) {
                                return (
                                    <Suspense key={userIndex} fallback={null}>
                                        <Billboard
                                            follow={true}
                                            lockX={true}
                                            lockY={true}
                                            lockZ={false}
                                        >
                                            <Text
                                                position={[0, 2.2, 0]}
                                                fontSize={0.2}
                                                color="white"
                                                anchorX="center"
                                                anchorY="bottom"
                                            >
                                                Avatar Name
                                            </Text>
                                        </Billboard>
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
                                            gender={userAvatar.gender}
                                            armLength={userAvatar.arm_length}
                                            armWidth={userAvatar.arm_width}
                                            legLength={userAvatar.leg_length}
                                            legWidth={userAvatar.leg_width}
                                        />
                                    </Suspense>
                                )
                            }
                            else {
                                return (
                                    <Suspense key={userIndex} fallback={null}>
                                        <Avatar
                                            group={avatarRef}
                                            setHeadNode={setHeadNode}
                                            isFirstPerson={isFirstPerson}
                                            setBaseUrl={setBaseUrl}
                                            setIsMoving={setIsMoving}
                                            isOpen={isOpen}
                                            avatar={userAvatar}
                                        />
                                    </Suspense>
                                )
                            }
                        })
                    }
                </>
            ))}
        </Canvas>
    );
}

'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, Suspense, useEffect } from 'react';
import { Billboard, Environment, Text } from '@react-three/drei';
import ThirdPersonCamera from './Avatar/camera/ThirdPerson';
import FirstPersonCamera from './Avatar/camera/FirstPerson';
import SampleBase from './Base/SampleBase';
import { SampleBase2 } from './Base/SampleBase2';
import { Avatar } from './Avatar';
import { useSelector } from 'react-redux';
import { fetchRoom, fetchRoomById, getSocket, reConnectUser } from '@/components/WebSocketClient';
import { Character } from './Avatar/Character';
import * as THREE from 'three'
import { generateQRCode } from '@/utils/qrcode.utils';
import QRPlane from '@/components/QRcode';

export default function Scene({ isOpen, isFirstPerson, setOnNear, setProduct }) {
    const { user } = useSelector((state) => state.user);
    const avatarRef = useRef(); // Reference for the main avatar
    const [headNode, setHeadNode] = useState();
    const [isMoving, setIsMoving] = useState(false);
    const [BaseUrl, setBaseUrl] = useState(true);
    const [room, setRoom] = useState([]);
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    // Dummy product data
    const products = [
        { id: 1, name: "Nike Shoes", price: "1000", description: "Comfortable running shoes.", image: 'https://res.cloudinary.com/dvpmx2xxb/image/upload/v1718208488/samples/shoe.jpg' },
        { id: 2, name: "Apple Watch", price: "2500", description: "Smartwatch with fitness tracking.", image: 'https://res.cloudinary.com/dvpmx2xxb/image/upload/v1718208493/samples/chair.png' },
        { id: 3, name: "Samsung Phone", price: "8000", description: "Latest smartphone with OLED display.", image: 'https://res.cloudinary.com/dvpmx2xxb/image/upload/v1718208473/samples/food/spices.jpg' },
        { id: 4, name: "Gaming Mouse", price: "500", description: "RGB gaming mouse with high DPI.", image: 'https://res.cloudinary.com/dvpmx2xxb/image/upload/v1718208489/samples/balloons.jpg' },
        { id: 5, name: "Bluetooth Speaker", price: "750", description: "Portable speaker with deep bass.", image: 'https://res.cloudinary.com/dvpmx2xxb/image/upload/v1718208471/samples/landscapes/beach-boat.jpg' }
    ];



    useEffect(() => {
        generateQRCode('https://metaverse-project-three.vercel.app/display/123').then((url) => setQrCodeUrl(url));
    }, []);

    useEffect(() => {
        if (user && user.roomId) {
            reConnectUser(user.id, user.roomId)
            fetchRoomById(user.roomId, setRoom);
        }
    }, [user]);

    return (
        <Canvas shadows>
            <Environment preset="park" />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 100]} />
            {isFirstPerson
                ? <FirstPersonCamera headNode={headNode} avatarRef={avatarRef} isMoving={isMoving} />
                : <ThirdPersonCamera avatarRef={avatarRef} isMoving={isMoving} />
            }
            <Suspense fallback={null}>
                {BaseUrl ? <SampleBase /> : <SampleBase2 />}
            </Suspense>

            {
                qrCodeUrl &&
                products.map((item, index) => (
                    <QRPlane url={qrCodeUrl} index={index} key={index} avatarRef={avatarRef} onNear={setOnNear} data={item} setProduct={setProduct} />
                ))
            }
            <>
                {
                    room &&
                    room.avatars?.map((userAvatar, userIndex) => {
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
        </Canvas >
    );
}

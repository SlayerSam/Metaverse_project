'use client';
import { Canvas } from '@react-three/fiber';
import { useRef, useState, Suspense, useEffect } from 'react';
import { Environment } from '@react-three/drei';
import ThirdPersonCamera from './Avatar/camera/ThirdPerson';
import FirstPersonCamera from './Avatar/camera/FirstPerson';
import SampleBase from './Base/SampleBase';
import { SampleBase2 } from './Base/SampleBase2';
import { Avatar } from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoomById, reConnectUser } from '@/components/WebSocketClient';
import { Character } from './Avatar/Character';
import * as THREE from 'three'
import { useObstacle } from '@/context/ObstacleContext';
import { setAvatar } from '@/redux/slices/userSlice';
import StandHereMarker from '@/components/Marker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';


export default function Scene({ isOpen, isFirstPerson }) {
    const router = useRouter()
    const { user, avatar } = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const avatarRef = useRef(); // Reference for the main avatar
    const [headNode, setHeadNode] = useState();
    const [isMoving, setIsMoving] = useState(false);
    const [BaseUrl, setBaseUrl] = useState(true);
    const [room, setRoom] = useState([]);
    const [isNear, setIsNear] = useState(false);
    const { obstaclesRef, registerObstacle, clearObstacles } = useObstacle();


    const checkCollisions = (nextPosition) => {
        const avatarBox = new THREE.Box3()?.setFromCenterAndSize(
            nextPosition,
            new THREE.Vector3(1, 2, 1) // Adjust to fit your avatar size
        )

        return obstaclesRef.current.some((obstacle) => avatarBox.intersectsBox(obstacle))
    }

    useEffect(() => {
        if (user && user.roomId) {
            clearObstacles(); // Reset on room change or new render
            reConnectUser(user.id, user.roomId)
            fetchRoomById(user.roomId, setRoom);
        }
    }, [user]);

    return (
        <>
            <Canvas shadows>
                <Environment preset="park" />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 100]} />
                {isFirstPerson
                    ? <FirstPersonCamera headNode={headNode} avatarRef={avatarRef} isMoving={isMoving} />
                    : <ThirdPersonCamera avatarRef={avatarRef} isMoving={isMoving} />
                }
                <Suspense fallback={null}>
                    {BaseUrl ? <SampleBase avatarRef={avatarRef} /> : <SampleBase2 />}
                </Suspense>
                <StandHereMarker position={[3, 0, 2]} label="Try Clothes Here" avatarRef={avatarRef} setIsNear={setIsNear} />
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
                                            position={new THREE.Vector3(userAvatar.position?.x, userAvatar.position?.y, userAvatar.position?.z)}
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
                                dispatch(setAvatar(userAvatar))
                                return (
                                    <Suspense key={userIndex} fallback={null}>
                                        <Avatar
                                            checkCollisions={checkCollisions}
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

            <Dialog open={isNear}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hi {user?.name}!</DialogTitle>
                        <DialogDescription className='flex justify-center flex-col gap-2'>
                            Wanna go to Try-On Portal?
                            <div className='flex justify-center items-center'>
                                <Button onClick={() => router.replace(`/try-on?type=shirt&gender=${avatar?.gender}`)}>Click to proceed</Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}

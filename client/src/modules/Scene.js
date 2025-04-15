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
import { useObstacle } from '@/context/ObstacleContext';
import CollisionDetector from '@/components/CollisionDetector';

export default function Scene({ isOpen, isFirstPerson, setOnNear, setProduct }) {
    const { user } = useSelector((state) => state.user);
    const avatarRef = useRef(); // Reference for the main avatar
    const [headNode, setHeadNode] = useState();
    const [isMoving, setIsMoving] = useState(false);
    const [BaseUrl, setBaseUrl] = useState(true);
    const [room, setRoom] = useState([]);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const { obstaclesRef, registerObstacle, clearObstacles } = useObstacle();

    const products = [
        {
            "id": 6,
            "title": "HrX Gree Hoddie",
            "description": "product info something",
            "model": "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743413460/v24jkcqsojzbg2qqsxhl.glb",
            "images": [
                "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743413643/jzdw4dzf64kawawuhpbc.png",
                "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743413642/tzebybwm3bxnpjfjs3ax.png",
                "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743413642/vtwqirgrjxf8ki1pnoh2.png",
                "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743413643/mxsb9yri4x8gme0vi6zg.png"
            ],
            "category": "shirt",
            "gender": "male",
            "price": 2499
        },
        {
            "id": 7,
            "title": "Gucci Men Leather Shoes",
            "description": "product info something",
            "model": "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743416260/cpyihatyvbgeosbycqd4.glb",
            "images": [
                "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743416369/lifw6ilosqzj7yrasdhu.pngh",
                "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743416369/uw8kspiq0rftbawkznrd.png",
                "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743416370/gvrmxauftfe36ahjv2fc.png",
                "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743416370/ml8zt9mpwbuduilnanbr.png"
            ],
            "category": "shoes",
            "gender": "male",
            "price": 8999
        },
        {
            "id": 8,
            "title": "Gucci Mens Leather Jacket",
            "description": "product info something",
            "model": "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743418428/w5k2v5dtb5i8jrpscaj5.glb",
            "images": [
                "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743418512/kria9wcptpasrucqmrql.png",
                "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743418512/cwfa4gvolplw4llxoum4.png",
                "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743418513/jkfg8q8fnonberswosbk.png",
                "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743418513/ul1hxd7pvmxuc5c1badw.png"
            ],
            "category": "shirt",
            "gender": "male",
            "price": 12999
        },
        {
            "id": 9,
            "title": "Leather Jacket",
            "description": "An Exclusive Leather Jacket made",
            "model": "https://res.cloudinary.com/dajyh1fci/image/upload/v1743421271/kziqecc9qo9wzz3yeb3x.glb",
            "images": [
                "https://res.cloudinary.com/dajyh1fci/image/upload/v1743419929/bmfo8qq3kt8tmvlfodmd.png",
                "https://res.cloudinary.com/dajyh1fci/image/upload/v1743419928/lvzhl4r1u5ryuekzxzwg.png",
                "https://res.cloudinary.com/dajyh1fci/image/upload/v1743419929/jb8q7migaqxs29ppj2pz.png",
                "https://res.cloudinary.com/dajyh1fci/image/upload/v1743419929/hkdluif5m2rhjyh7g1w9.png"
            ],
            "category": "shirt",
            "gender": "male",
            "price": 7499
        },
        {
            "id": 10,
            "title": "Womens Leather Jacket",
            "description": "product info something",
            "model": "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743434325/xjmjjyb2nhb4gcgxco92.glb",
            "images": [
                "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743434449/unz9llntb3hmhxurnaqi.png",
                "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743434449/r8yndfpaakxsvdthtwsz.png",
                "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743434449/ge9w3snnoj1ydjuifnmm.png",
                "https://res.cloudinary.com/dyexgwzsb/image/upload/v1743434449/cuohry015imyjayqzbfg.png"
            ],
            "category": "shirt",
            "gender": "male",
            "price": 5999
        },
        {
            "id": 11,
            "title": "Full Sail University Jacket",
            "description": "The moodern day stylish jacket for the cool dudes",
            "model": "https://res.cloudinary.com/dajyh1fci/image/upload/v1743436138/htwycrfrahezaduaqslo.glb",
            "images": [
                "https://res.cloudinary.com/dajyh1fci/image/upload/v1743436186/atsbce5i0zniiac2dn5r.png",
                "https://res.cloudinary.com/dajyh1fci/image/upload/v1743436189/p6ctrep1xw4s6quseixd.png",
                "https://res.cloudinary.com/dajyh1fci/image/upload/v1743436191/qvydefrcdoabawtwtv5o.png",
                "https://res.cloudinary.com/dajyh1fci/image/upload/v1743436192/cpvattwedoreosxnkddg.png"
            ],
            "category": "shirt",
            "gender": "male",
            "price": 5299
        },
        {
            "id": 12,
            "title": "Tommy Hilfiger Jacket",
            "description": "This limited edition jacket seems just the product made for you, but cool, be cool",
            "model": "https://res.cloudinary.com/dajyh1fci/image/upload/v1743434557/fyn3dc21zmbfkk9pd2i7.glb",
            "images": [
                "https://res.cloudinary.com/dajyh1fci/image/upload/v1743434577/xbgtvu7uepeeakdjv2ez.png",
                "https://res.cloudinary.com/dajyh1fci/image/upload/v1743434567/yi2emjt3hjcezj7lxyhq.png",
                "https://res.cloudinary.com/dajyh1fci/image/upload/v1743434575/ipohc452auudxp3i4dyq.png",
                "https://res.cloudinary.com/dajyh1fci/image/upload/v1743434575/yqarzn9su7zksnfhwnoh.png"
            ],
            "category": "shirt",
            "gender": "male",
            "price": 8499
        }
    ]

    useEffect(() => {
        generateQRCode('https://metaverse-project-three.vercel.app/display/123').then((url) => setQrCodeUrl(url));
    }, []);

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
        <Canvas shadows>
            <Environment preset="park" />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 100]} />
            {isFirstPerson
                ? <FirstPersonCamera headNode={headNode} avatarRef={avatarRef} isMoving={isMoving} />
                : <ThirdPersonCamera avatarRef={avatarRef} isMoving={isMoving} />
            }
            {/* <CollisionDetector /> */}
            <Suspense fallback={null}>
                {BaseUrl ? <SampleBase /> : <SampleBase2 />}
            </Suspense>
            {/* <CollisionDetector avatarRef={avatarRef} /> */}

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
    );
}

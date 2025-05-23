'use client'
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { useState } from 'react'

const store = createXRStore()

export default function Page() {
    const [red, setRed] = useState(false)
    return (
        <>
            <button onClick={() => store.enterAR()}>Enter AR</button>
            <Canvas>
                <XR store={store}>
                    <mesh pointerEventsType={{ deny: 'grab' }} onClick={() => setRed(!red)} position={[0, 1, -3]}>
                        <boxGeometry />
                        <meshBasicMaterial color={red ? 'red' : 'blue'} />
                    </mesh>
                </XR>
            </Canvas>
        </>
    )
}
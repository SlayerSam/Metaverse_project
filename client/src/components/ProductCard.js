'use client'
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { buyProduct } from './WebSocketClient';
import {
    ShoppingCart,
    Plus,
    Minus,
    ChevronLeft,
    ChevronRight,
    ShirtIcon,
    QrCodeIcon,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart as addToCartAction } from '@/redux/slices/cartSlice';
import { generateQRCode } from '@/utils/qrcode.utils';


export default function ProductCard({ product}) {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cartItems);
    const cartItem = cart.find((item) => item.id === product.id);
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        generateQRCode('https://metaverse-project-three.vercel.app/display/123').then((url) => setQrCodeUrl(url));
    }, []);
    const [quantity, setQuantity] = useState(cartItem?.quantity || 1);
    const [showQR, setShowQR] = useState(false);

    const isInCart = !!cartItem;

    const addToCart = () => {
        const productWithQuantity = { ...product, quantity };
        dispatch(addToCartAction(productWithQuantity));
    };


    return (
        <>
            <div
                className={`w-full h-full fixed z-[100] flex justify-center right-0 rounded-b-lg backdrop-blur-md top-0 dark:bg-[rgba(0,0,0,0.53)] bg-[rgba(255,255,255,0.43)] transition-all duration-300}`}
            >
                <div className="w-full h-full flex flex-col items-center relative">

                    {/* Image Carousel */}
                    <div className="h-1/2 w-1/2 relative flex items-center justify-center p-3">
                        <img
                            loading="lazy"
                            className="w-full h-full object-fill aspect-square rounded-lg"
                            src={product.image}
                            alt={`Product ${product.title}`}
                        />
                    </div>

                    {/* Product Info */}
                    <div className="w-4/5 p-2 flex flex-col">
                        <p className="text-2xl font-semibold">{product.title}</p>
                        <p>{product.description}</p>
                    </div>

                    {/* Price */}
                    <div className="w-4/5 flex p-2">
                        <p className="font-bold text-3xl">{product.price}/-</p>
                    </div>

                    {/* Quantity + Cart + QR */}
                    <div className="w-4/5 p-2 flex justify-between items-center gap-4">
                        <div className="flex items-center bg-accent px-1 rounded-md">
                            <Button variant="ghost" size="icon" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>
                                <Minus size={16} />
                            </Button>
                            <div className="w-0 border h-7 border-accent-foreground mx-3"></div>
                            <span className="text-lg p-1">{cartItem?.quantity || quantity}</span>
                            <div className="w-0 border h-7 border-accent-foreground mx-3"></div>
                            <Button variant="ghost" size="icon" onClick={() => setQuantity((prev) => prev + 1)}>
                                <Plus size={16} />
                            </Button>
                        </div>

                        <Button
                            className={`flex gap-2 ${isInCart ? 'bg-green-600 text-white' : 'bg-secondary'}`}
                            variant="secondary"
                            onClick={addToCart}
                        >
                            {isInCart ? 'In Cart' : 'Add to Cart'}
                            <ShoppingCart size={16} />
                        </Button>

                        <Button variant="outline" size="icon" className="z-40 p-2" onClick={() => setShowQR(true)} title="Show QR">
                            <QrCodeIcon size={24} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* QR Modal */}
            {showQR && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl text-center relative">
                        <h2 className="text-xl font-bold mb-4">Scan to View Product</h2>
                        {qrCodeUrl ? (
                            <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
                        ) : (
                            <p>Loading QR...</p>
                        )}
                        <button
                            onClick={() => setShowQR(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}

        </>
    );
}

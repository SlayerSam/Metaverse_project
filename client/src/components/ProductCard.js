import React, { useState } from 'react';
import { Button } from './ui/button';
import { buyProduct } from './WebSocketClient';
import { ShoppingBag, ShoppingCart, Plus, Minus, ChevronLeft, ChevronRight, ShirtIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart as addToCartAction } from '@/redux/slices/cartSlice';
import { resetFemaleAvatar, resetMaleAvatar, updateFemaleAvatar, updateMaleAvatar } from '@/redux/slices/avatarSlice';

export default function ProductCard({ onNear, product }) {
    const dispatch = useDispatch();
    const { maleAvatar, femaleAvatar } = useSelector(state => state.avatar);
    const cart = useSelector(state => state.cart.cartItems);
    const cartItem = cart.find(item => item.id === product.id);

    const [quantity, setQuantity] = useState(cartItem?.quantity || 1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = product.images || []; // Assume this is an array

    const isInCart = !!cartItem;

    const addToCart = () => {
        const productWithQuantity = { ...product, quantity };
        dispatch(addToCartAction(productWithQuantity));
    };

    const getStateType = (category) => {
        if (category == 'shirt') {
            return 'shirtModelUrl';
        }
        if (category == 'pant') {
            return 'pantModelUrl';
        }
    }

    const checkProductUrl = () => {
        const { model, category, gender } = product;

        if (gender == 'male') {
            console.log(maleAvatar, getStateType(category))
            if (maleAvatar[getStateType(category)] == model) {
                return true
            }
            return false
        }
        else {
            if (femaleAvatar[getStateType(category)] == model) {
                return true
            }
            return false

        }
    }

    const updateModels = () => {
        if (product.gender == 'male') {
            if (checkProductUrl()) {
                dispatch(resetMaleAvatar())
            }
            else {
                dispatch(updateMaleAvatar({ [getStateType(product.category)]: product.model }))
            }
        }
        else {
            if (checkProductUrl()) {
                dispatch(resetFemaleAvatar())
            }
            else {
                dispatch(updateFemaleAvatar({ [getStateType(product.category)]: product.model }))
            }
        }
    }

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className={`w-1/3 h-3/5 fixed z-[11] flex justify-center right-0 rounded-b-lg backdrop-blur-md top-0 dark:bg-[rgba(0,0,0,0.53)] bg-[rgba(255,255,255,0.43)] transition-all duration-300 ${onNear ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <div className='w-full h-full flex flex-col items-center relative'>
                <div className={`w-10 h-10 absolute right-3 top-3 border-2 flex justify-center items-center rounded-lg border-gray-300 transition-all hover:bg-muted cursor-pointer ${checkProductUrl() ? 'bg-red-400' : 'bg-none'}`} onClick={updateModels}>
                    <ShirtIcon />
                </div>
                {/* Image Carousel */}
                <div className='h-1/2 w-1/2 relative flex items-center justify-center p-3'>
                    {images.length > 0 && (
                        <img
                            loading='lazy'
                            className='w-full h-full object-fill aspect-square rounded-lg'
                            src={images[currentImageIndex]}
                            alt={`Product ${currentImageIndex + 1}`}
                        />
                    )}
                    {images.length > 1 && (
                        <>
                            <Button variant="ghost" size="icon" className="absolute left-2" onClick={prevImage}>
                                <ChevronLeft size={20} />
                            </Button>
                            <Button variant="ghost" size="icon" className="absolute right-2" onClick={nextImage}>
                                <ChevronRight size={20} />
                            </Button>
                        </>
                    )}
                </div>

                {/* Product Info */}
                <div className='w-4/5 p-2 flex flex-col'>
                    <p className='text-2xl font-semibold'>{product.name}</p>
                    <p>{product.description}</p>
                </div>

                {/* Price */}
                <div className='w-4/5 flex p-2'>
                    <p className='font-bold text-3xl'>{product.price}/-</p>
                </div>

                {/* Quantity + Add to Cart */}
                <div className='w-4/5 p-2 flex justify-end items-center gap-4'>
                    <div className='flex items-center bg-accent px-1 rounded-md'>
                        <Button variant='ghost' size='icon' onClick={() => setQuantity(prev => Math.max(1, prev - 1))}><Minus size={16} /></Button>
                        <div className='w-0 border h-7 border-accent-foreground mx-3'></div>
                        <span className='text-lg p-1'>{cartItem?.quantity || quantity}</span>
                        <div className='w-0 border h-7 border-accent-foreground mx-3'></div>
                        <Button variant='ghost' size='icon' onClick={() => setQuantity(prev => prev + 1)}><Plus size={16} /></Button>
                    </div>

                    <Button
                        className={`w-fit flex gap-2 ${isInCart ? 'bg-green-600 text-white' : 'bg-secondary'}`}
                        variant='secondary'
                        onClick={addToCart}
                    >
                        {isInCart ? 'In Cart' : 'Add to Cart'}
                        <ShoppingCart size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { Button } from './ui/button';
import { buyProduct } from './WebSocketClient';
import { ShoppingBag, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart as addToCartAction } from '@/redux/slices/cartSlice';

export default function ProductCard({ onNear, product }) {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart.cartItems);
    const cartItem = cart.find(item => item.id === product.id);

    // Check if the product is already in the cart
    const [quantity, setQuantity] = useState(cartItem?.quantity || 1);
    const isInCart = !!cartItem;

    // Update quantity in cart
    const addToCart = () => {
        const productWithQuantity = { ...product, quantity };
        dispatch(addToCartAction(productWithQuantity));
    };

    return (
        <div className={`w-1/3 h-3/5 fixed z-[11] flex justify-center right-0 rounded-b-lg backdrop-blur-md top-0 dark:bg-[rgba(0,0,0,0.53)] bg-[rgba(255,255,255,0.43)] transition-all duration-300 ${onNear ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <div className='w-full h-full flex flex-col items-center'>
                <div className='h-1/2 w-1/2 flex p-3'>
                    <img className='w-full h-full object-cover aspect-square' src={product.image} alt={product.name} />
                </div>
                <div className='w-4/5 p-2 flex flex-col '>
                    <p className='text-2xl font-semibold'>{product.name}</p>
                    <p>{product.description}</p>
                </div>
                <div className='w-4/5 flex p-2'>
                    <p className='font-bold text-3xl'>{product.price}/-</p>
                </div>
                <div className='w-4/5 p-2 flex justify-end items-center gap-4'>
                    <div className='flex items-center bg-accent px-1 rounded-md'>
                        <Button variant='ghost' size='icon' onClick={() => setQuantity(prev => Math.max(1, prev - 1))}><Minus size={16} /></Button>
                        <div className='w-0 border h-7 border-accent-foreground mx-3'></div>
                        <span className='text-lg p-1'>{cartItem?.quantity ? cartItem.quantity : quantity}</span>
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
                    {/* <Button className='w-fit px-4 flex gap-2' onClick={() => buyProduct(product.id, product.price * quantity, quantity)}>Buy <ShoppingBag size={16} /></Button> */}
                </div>
            </div>
        </div>
    );
}

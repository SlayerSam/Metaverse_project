"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash2 } from "lucide-react";
import { removeFromCart } from "@/redux/slices/cartSlice";

export function CartMenu() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const [selectedItem, setSelectedItem] = React.useState(null);
  const [quantityToRemove, setQuantityToRemove] = React.useState(1);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const openDialog = (item) => {
    setSelectedItem(item);
    setQuantityToRemove(1);
    setIsDialogOpen(true);
  };

  const handleRemove = () => {
    if (!selectedItem) return;

    if (quantityToRemove >= selectedItem.quantity) {
      dispatch(removeFromCart(selectedItem.id)); // Remove item completely
    } else {
      dispatch(removeFromCart({ id: selectedItem.id, quantity: quantityToRemove })); // Decrease quantity
    }

    setIsDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2">
            <ShoppingCart size={18} /> Cart ({cartItems?.length || 0})
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuLabel className="font-semibold">Your Cart</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {cartItems?.length === 0 ? (
            <p className="text-center p-2 text-sm">Your cart is empty.</p>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {cartItems?.map((item) => (
                <div key={item.id} className="flex justify-between p-2 border-b items-center">
                  <span>{item.name} (x{item.quantity})</span>
                  <span className="font-bold">₹{item.price * item.quantity}</span>
                  <Trash2 
                    className="hover:stroke-red-600 transition-all cursor-pointer"
                    onClick={() => openDialog(item)}
                  />
                </div>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Item</DialogTitle>
          </DialogHeader>
          <p>Select how many items you want to remove.</p>
          <Input 
            type="number" 
            min="1" 
            max={selectedItem?.quantity || 1} 
            value={quantityToRemove} 
            onChange={(e) => setQuantityToRemove(Math.min(Math.max(1, Number(e.target.value)), selectedItem?.quantity))}
          />
          <DialogFooter>
            <Button variant="destructive" onClick={handleRemove}>Remove</Button>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

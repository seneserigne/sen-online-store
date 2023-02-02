import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ items: []});

  constructor(private _snackbar: MatSnackBar) { }

  onAddToCart(item: CartItem): void {
    const items = [...this.cart.value.items];

    const itemInCart = items.find((_item) => _item.id === item.id);

    if(itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item);
    }

    this.cart.next({ items });
    this._snackbar.open('1 item added to cart.', 'Ok', { duration: 3000 });

    console.log(this.cart.value);
  }

  getTotal(items: Array<CartItem>): number {
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0)
  }

  clearCart(): void {
    this.cart.next({ items: []});
    this._snackbar.open('Your cart is now cleared!', 'Ok', { duration: 3000 });
  }

  removeItemFromCart(item: CartItem, notifyUser: boolean): Array<CartItem> {
    const filteredItem = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );

    if(notifyUser) {
      this.cart.next({ items: filteredItem });
      this._snackbar.open('1 item was removed from your cart!', 'Ok', { duration: 3000 });
    }

    return filteredItem;
  }

  reduceQuantity(item: CartItem): void {
    let ItemToRemove: CartItem | undefined;
    
    let filteredItems = this.cart.value.items
      .map((_item) => {
        if(_item.id === item.id) {
          _item.quantity--;

          if(_item.quantity === 0) {
            ItemToRemove = _item;
          }
        }

        return _item;
      });

      if(ItemToRemove) {
        filteredItems = this.removeItemFromCart(ItemToRemove, false);
      }

      this.cart.next({ items: filteredItems });
      this._snackbar.open('1 item was removed from your cart!', 'Ok', { duration: 3000 });
  }

}

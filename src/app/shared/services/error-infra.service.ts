import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class ErrorInfra {

  constructor(private snackBar:MatSnackBar) { }

  // Opens a error message with given message and a close button
  openSimleSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
       duration: 3500,
       verticalPosition: 'top',
       direction: 'rtl'
    });
  }
}
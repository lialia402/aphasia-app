import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent implements OnInit {
  userType: string | undefined;
  @Output() userTypeChanged: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onItemChange(value : any){
    this.userTypeChanged.emit(value);
 }

}

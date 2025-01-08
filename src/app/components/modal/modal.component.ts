import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Output() confirmResponse = new EventEmitter<boolean>();

  message: string = '';

  onConfirm() {
    this.confirmResponse.emit(true);
  }

  onCancel() {
    this.confirmResponse.emit(false);
  }

}


import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { OverlayService } from './overlay.service';
import { ModalComponent } from '../components/modal/modal.component';
import { Injector } from '@angular/core';

interface ModalData {
  title: string;
  message: string;
  buttons: any[]; // Array de botones para manejar eventos
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new BehaviorSubject<boolean>(false);
  modal$ = this.modalSubject.asObservable();
  private modalRef: any = null;

  constructor(private _overlayService: OverlayService, private injector: Injector) {}

  confirm(message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      // Evitar crear más de una modal
      if (this.modalRef) {
        return; // Si ya existe un modal, no creamos otro
      }

      // Crear el modal
      this.modalRef = this._overlayService.show(ModalComponent, this.injector);
      this.modalRef.instance.message = message;

      // Manejar la respuesta del modal
      this.modalRef.instance.confirmResponse.subscribe((response: boolean) => {
        this.modalSubject.next(response);
        resolve(response);
        this.closeModal(); // Cerrar modal después de la respuesta
      });
    });
  }

  closeModal() {
    if (this.modalRef) {
      this._overlayService.hide(); // Ocultar overlay
      this.modalRef = null; // Limpiar referencia del modal
    }
  }

  open(modalData: ModalData): void {
    // Emitimos los datos del modal
    //this.modalSubject.next(modalData);
    console.log('Modal abierto:', modalData);
  }

  close(): void {
    // Emitimos el evento de cerrar modal
    //this.modalSubject.next({ title: '', message: '', buttons: [] });
    console.log('Modal cerrado');
  }
}

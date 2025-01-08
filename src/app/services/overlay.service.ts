import { Injectable, ComponentRef, Injector, ApplicationRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  constructor(private appRef: ApplicationRef, private injector: Injector) {}

  show(component: any, injector: Injector): ComponentRef<any> {
    // Crear un contenedor dinámicamente
    const overlayContainer = document.createElement('div');
    overlayContainer.classList.add('overlay-container');
    document.body.appendChild(overlayContainer);

    // Crear el componente dinámico y obtener su referencia
    const componentRef = this.appRef.bootstrap(component, overlayContainer);

    // Devolver la referencia del componente
    return componentRef;
  }

  hide() {
    // Lógica para ocultar el overlay
    const overlayContainer = document.querySelector('.overlay-container');
    if (overlayContainer) {
      overlayContainer.remove(); // Eliminar el contenedor del overlay
    }
  }
}

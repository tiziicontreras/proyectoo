import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contacto',
  imports: [RouterLink],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {

  // Al enviar: evita que se recargue la página, avisa y limpia el formulario
  enviar(evento: Event, formulario: HTMLFormElement): void {
    evento.preventDefault();
    alert('Mensaje enviado');
    formulario.reset();
  }
}
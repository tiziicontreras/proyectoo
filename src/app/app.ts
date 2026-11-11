
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './compartidos/nav/nav';
import { Footer } from './compartidos/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProyectoTC');
}

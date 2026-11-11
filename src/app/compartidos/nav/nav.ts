import { Component, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";
import { CarritoService } from "../../servicios/carrito.service";
@Component({
 selector: "app-nav",
 imports: [RouterLink],
 templateUrl: "./nav.html",
 styleUrl: "./nav.css"
})
export class NavComponent {
 // Indica si el menú lateral está abierto
 menuAbierto = signal(false);

 // "public" para poder usar auth y carritoService directamente desde el HTML
 constructor(
  public auth: AuthService,
  public carritoService: CarritoService,
  private router: Router
 ) {}

 abrirMenu(): void {
  this.menuAbierto.set(true);
 }

 cerrarMenu(): void {
  this.menuAbierto.set(false);
 }

 // Botón Salir: cierra la sesión y vuelve a la pantalla de login
 salir(): void {
  this.auth.logout();
  this.cerrarMenu();
  this.router.navigate(["/auth/inicio-sesion"]);
 }
}
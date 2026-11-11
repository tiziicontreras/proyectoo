import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";

@Component({
  selector: "app-registro",
  imports: [FormsModule, RouterLink],
  templateUrl: "./registro.component.html",
  styleUrl: "./registro.css"
})
export class RegistroComponent {

  nombre = "";
  email = "";
  email2 = "";
  clave = "";
  clave2 = "";
  error = signal("");

  constructor(private auth: AuthService, private router: Router) {}

  registrar(): void {
    this.error.set("");

    const nombre = this.nombre.trim();
    const email = this.email.trim().toLowerCase();
    const email2 = this.email2.trim().toLowerCase();

    // Campos vacíos
    if (!nombre || !email || !email2 || !this.clave.trim() || !this.clave2.trim()) {
      this.error.set("Completá todos los campos");
      return;
    }

    // Falta la @
    if (!email.includes("@")) {
      this.error.set("El correo tiene que incluir el símbolo @");
      return;
    }

    // Formato inválido (por ejemplo "juan@" o "juan@gmail")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.error.set("Ingresá un correo válido, por ejemplo nombre@gmail.com");
      return;
    }

    // Los correos tienen que coincidir
    if (email !== email2) {
      this.error.set("Los correos no coinciden");
      return;
    }

    // Las contraseñas tienen que coincidir
    if (this.clave !== this.clave2) {
      this.error.set("Las contraseñas no coinciden");
      return;
    }

    // La API espera la clave "contraseña" en el JSON;
    // la variable del componente se llama clave
    this.auth.registro({ nombre, email, contraseña: this.clave }).subscribe({
      next: () => this.router.navigate(["/auth/inicio-sesion"]),
      error: (e: HttpErrorResponse) => {
        if (e.status === 0) {
          this.error.set("No se pudo conectar con el servidor");
        } else {
          this.error.set(e.error?.error ?? "No se pudo registrar");
        }
      }
    });
  }
}
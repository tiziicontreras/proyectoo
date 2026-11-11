import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { AuthService } from "../../servicios/auth.service";
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-inicio-sesion",
  imports: [FormsModule, RouterLink],
  templateUrl: "./inicio-sesion.component.html",
  styleUrl: "./inicio-sesion.css"
})
export class InicioSesionComponent {

  email = "";
  clave = "";
  error = signal("");

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ingresar(): void {
  this.error.set("");

  const email = this.email.trim().toLowerCase();
  // Si falta algún dato, avisamos sin consultar al servidor
  if (!email || !this.clave.trim()) {
    this.error.set("Completá el correo y la contraseña");
    return;
  }

  // Falta la @
  if (!email.includes("@")) {
    this.error.set("El correo tiene que incluir el símbolo @");
    return;
  }

  // Formato general inválido (por ejemplo "juan@" o "juan@gmail")
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    this.error.set("Ingresá un correo válido, por ejemplo nombre@gmail.com");
    return;
  }

  this.auth.login(email, this.clave).subscribe({
    next: () => {
      this.router.navigate([
        this.auth.esAdmin() ? "/paginas/admin" : "/inicio"
      ]);
    },
    error: (err: HttpErrorResponse) => {
      console.log("Error del login:", err.status, err.error);

      if (err.status === 0) {
        this.error.set("No se pudo conectar con el servidor");
      } else {
        this.error.set(err.error?.error || "Email o contraseña incorrectos");
      }
    }
  });
}
}
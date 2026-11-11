// Importa Injectable, signal, inject y PLATFORM_ID de Angular.
// Injectable permite utilizar esta clase como un servicio.
// signal permite guardar datos que se actualizan automáticamente en la aplicación.
// inject y PLATFORM_ID permiten saber si el código corre en el navegador o en el servidor (SSR).
import { Injectable, signal, inject, PLATFORM_ID } from "@angular/core";

// isPlatformBrowser devuelve true solo cuando el código corre en el navegador.
import { isPlatformBrowser } from "@angular/common";

// Importa HttpClient, que permite realizar peticiones HTTP
// al backend desarrollado en PHP.
import { HttpClient } from "@angular/common/http";

// Importa Observable, que representa una operación que puede
// devolver una respuesta más adelante, y tap, que permite
// ejecutar acciones cuando llega esa respuesta.
import { Observable, tap } from "rxjs";

// Indica que Angular puede crear este servicio automáticamente
// y que estará disponible en toda la aplicación.
@Injectable({ providedIn: "root" })
export class AuthService {

  // Guarda la dirección base de los endpoints de usuarios
  // de nuestra API REST desarrollada en PHP.
  private apiUrl = "http://localhost/API_PROYECTOB/public/usuarios";

  // Indica si el código está corriendo en el navegador.
  // En el servidor (SSR) localStorage no existe, por eso hay que comprobarlo.
  // IMPORTANTE: tiene que ir antes de usuarioActual, porque ese lo usa al crearse.
  private esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  // Guarda el usuario logueado en una señal.
  // Cuando cambia, Angular actualiza automáticamente los componentes
  // que utilizan esta información, por ejemplo el NAV.
  // Si no hay usuario guardado (o estamos en el servidor), empieza en null.
  private usuarioActual = signal<any>(
    this.esNavegador
      ? JSON.parse(localStorage.getItem("usuario") || "null")
      : null
  );

  // Inyecta HttpClient para poder enviar peticiones al backend.
  constructor(private http: HttpClient) {}

  // Registra un usuario nuevo.
  // Recibe un objeto datos con la información del formulario.
  // Observable<any> indica que la respuesta llegará de forma asíncrona.
  registro(datos: any): Observable<any> {

    // Envía una petición POST a la dirección /registro
    // y envía los datos del nuevo usuario en el cuerpo.
    return this.http.post(`${this.apiUrl}/registro`, datos);
  }

  // Inicia sesión con el correo electrónico y la contraseña.
  // Devuelve un Observable con la respuesta del servidor.
  login(email: string, contraseña: string): Observable<any> {

    // Envía una petición POST al endpoint /login.
    // El correo y la contraseña se envían en el cuerpo de la petición.
    return this.http.post(`${this.apiUrl}/login`, { email, contraseña }).pipe(

      // tap permite realizar acciones adicionales cuando llega la respuesta,
      // sin modificar los datos que devuelve el servidor.
      tap((respuesta: any) => {

        if (this.esNavegador) {
          // Guarda el token que devuelve el servidor.
          // Luego se utiliza para autenticar otras peticiones.
          localStorage.setItem("token", respuesta.token);

          // Convierte los datos del usuario a texto JSON
          // y los guarda en el almacenamiento local del navegador.
          localStorage.setItem("usuario", JSON.stringify(respuesta.usuario));
        }

        // Actualiza la señal con los datos del usuario logueado.
        // De esta manera, Angular avisa a los componentes que hay alguien conectado.
        this.usuarioActual.set(respuesta.usuario);
      })
    );
  }

  // Cierra la sesión eliminando los datos guardados
  // en el almacenamiento local del navegador.
  logout(): void {

    if (this.esNavegador) {
      // Elimina el token de autenticación.
      localStorage.removeItem("token");

      // Elimina los datos del usuario.
      localStorage.removeItem("usuario");
    }

    // Actualiza la señal con null.
    // Avisa a la aplicación que ya no hay ninguna sesión iniciada.
    this.usuarioActual.set(null);
  }

  // Obtiene el token que está guardado en el navegador.
  // Si no existe (o estamos en el servidor), devuelve null.
  getToken(): string | null {
    return this.esNavegador ? localStorage.getItem("token") : null;
  }

  // Comprueba si hay un usuario logueado.
  // Si usuarioActual tiene datos, devuelve true.
  // Si es null, devuelve false.
  estaLogueado(): boolean {
    return this.usuarioActual() !== null;
  }

  // Comprueba si el usuario guardado tiene el rol de administrador.
  // Devuelve true si su rol es "admin".
  esAdmin(): boolean {
    return this.usuarioActual()?.rol === "admin";
  }

  // Obtiene el nombre del usuario que inició sesión.
  // Si no hay ningún usuario o no tiene nombre, devuelve un texto vacío.
  nombreUsuario(): string {
    return this.usuarioActual()?.nombre ?? "";
  }
}
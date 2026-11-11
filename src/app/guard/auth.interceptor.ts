// Importa HttpInterceptorFn para crear un interceptor de peticiones HTTP.
import { HttpInterceptorFn } from "@angular/common/http";

// Permite obtener servicios de Angular mediante inject().
import { inject } from "@angular/core";

// Importa el servicio que permite obtener el token del usuario.
import { AuthService } from "../servicios/auth.service";

// Crea el interceptor que interviene en las solicitudes HTTP.
// peticion representa la solicitud y siguiente permite continuar su recorrido.
export const authInterceptor: HttpInterceptorFn = (peticion, siguiente) => {

 // Obtiene el token guardado mediante AuthService.
 const token = inject(AuthService).getToken();

 // Comprueba si existe un token.
 if (token) {

   // Las solicitudes HTTP son inmutables, por eso se crea una copia.
   // A esa copia se le agrega el encabezado Authorization con el token.
   peticion = peticion.clone({
     setHeaders: {
       Authorization: `Bearer ${token}`
     }
   });
 }

 // Envía la solicitud hacia la API, con el token si existía.
 return siguiente(peticion);
};
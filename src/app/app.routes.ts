import { Routes } from "@angular/router";
import { adminGuard } from "./guard/admin.guard";
import { Inicio } from "./paginas/inicio/inicio";
import { ProductosComponent } from "./paginas/productos/productos";
import { InicioSesionComponent } from "./auth/inicio-sesion/inicio-sesion";
import { RegistroComponent } from "./auth/registro/registro";
import { AdminComponent } from "./paginas/admin/admin";
import { TicketComponent } from "./paginas/ticket/ticket";
import { CompraComponent } from "./paginas/compra/compra";
import { Ofertas } from "./paginas/ofertas/ofertas";
import { CarritoComponent } from "./compartidos/carrito/carrito";
import { FavoritosComponent } from "./compartidos/favoritos/favoritos";
import { ComprasComponent } from "./paginas/compras/compras";
import { Contacto } from "./paginas/contacto/contacto";
export const routes: Routes = [
 { path: "", redirectTo: "inicio", pathMatch: "full" },
 { path: "inicio", component: Inicio },
 { path: "productos", component: ProductosComponent },
 { path: "auth/inicio-sesion", component: InicioSesionComponent },
 { path: "auth/registro", component: RegistroComponent },
 { path: "paginas/admin", component: AdminComponent, canActivate: [adminGuard] },
// protegida
 { path: "paginas/ticket/:id", component: TicketComponent },
 { path: "paginas/compra", component: CompraComponent },
 { path: "paginas/ofertas", component: Ofertas },
 { path: "carrito", component: CarritoComponent },
 { path: "favoritos", component: FavoritosComponent },
 { path: "paginas/compras", component: ComprasComponent },
 { path: "paginas/contacto", component: Contacto },
 { path: "**", redirectTo: "inicio" },
];
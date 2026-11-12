import { Component, computed, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";
import { CarritoService } from "../../servicios/carrito.service";
import { ProductService } from "../../servicios/product";

@Component({
 selector: "app-nav",
 imports: [RouterLink],
 templateUrl: "./nav.html",
 styleUrl: "./nav.css"
})
export class NavComponent {
 // Indica si el menú lateral está abierto
 menuAbierto = signal(false);

 // Buscador
 buscadorAbierto = signal(false);
 texto = signal("");
 private todos = signal<any[]>([]);
 private carpetaImagenes = "/assets/";

 // Productos cuyo nombre se parece a lo que se escribió (máximo 6)
 sugerencias = computed(() => {
  const t = this.normalizar(this.texto());
  if (!t) return [];
  return this.todos()
   .filter(p => this.normalizar(p.nombre).includes(t))
   .slice(0, 6);
 });

 // "public" para poder usar auth y carritoService directamente desde el HTML
 constructor(
  public auth: AuthService,
  public carritoService: CarritoService,
  private productService: ProductService,
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

 // BUSCADOR
 abrirBuscador(campo: HTMLInputElement): void {
  this.buscadorAbierto.set(true);
  this.cargarProductos();
  setTimeout(() => campo.focus(), 0);
 }

 cerrarBuscador(): void {
  this.buscadorAbierto.set(false);
  this.texto.set("");
 }

 // Trae los productos y calcula el precio de oferta de cada uno
 private cargarProductos(): void {
  this.productService.listar("").subscribe({
   next: (lista) => {
    const productos = (lista as any[]).map(p => {
     const precio = Number(p.precio);
     const oferta = Number(p.precio_oferta ?? p.precioOferta);
     return {
      ...p,
      precio,
      precioOferta: oferta > 0 && oferta < precio ? oferta : undefined
     };
    });
    this.todos.set(productos);
   },
   error: (err) => console.error("Error al cargar productos para buscar:", err)
  });
 }

 // Enter: elige la primera sugerencia, o busca por el texto escrito
 buscarEnter(): void {
  const primera = this.sugerencias()[0];
  if (primera) {
   this.elegir(primera);
   return;
  }
  const t = this.texto().trim();
  if (!t) return;
  this.router.navigate(["/productos"], { queryParams: { buscar: t } });
  this.cerrarBuscador();
 }

 // Al elegir un producto va a Productos u Ofertas, filtrado por su nombre
 elegir(p: any): void {
  const ruta = p.precioOferta ? "/paginas/ofertas" : "/productos";
  this.router.navigate([ruta], { queryParams: { buscar: p.nombre } });
  this.cerrarBuscador();
 }

 imagenUrl(p: any): string {
  const nombre = p.imagen ?? p.img ?? "";
  if (!nombre) return "";
  if (nombre.startsWith("http")) return nombre;
  return this.carpetaImagenes + nombre;
 }

 formato(valor: number): string {
  return Number(valor).toLocaleString("es-AR");
 }

 // Minúsculas y sin tildes, para comparar nombres
 private normalizar(s: string): string {
  return (s ?? "")
   .toLowerCase()
   .normalize("NFD")
   .replace(/[\u0300-\u036f]/g, "")
   .trim();
 }
}
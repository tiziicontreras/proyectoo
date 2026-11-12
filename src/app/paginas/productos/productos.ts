import { Component, OnInit, signal, computed } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../servicios/product";
import { CarritoService } from "../../servicios/carrito.service";
import { FavoritoService } from "../../servicios/favoritoService";
import { Producto } from "../../models/producto";

@Component({
  selector: "app-productos",
  imports: [FormsModule],
  templateUrl: "./productos.component.html",
  styleUrl: "./productos.css"
})
export class ProductosComponent implements OnInit {

  productos = signal<Producto[]>([]);
  buscar = "";

  productosNormales = computed(() =>
    this.productos().filter(p => !this.esOferta(p))
  );

  ofertas = computed(() =>
    this.productos().filter(p => this.esOferta(p))
  );

  private carpetaImagenes = "/assets/";

  constructor(
    private productService: ProductService,
    private carrito: CarritoService,
    private favoritoService: FavoritoService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.productService.listar(this.buscar).subscribe({
      next: (lista) => {
        console.log(lista);
        const productos = (lista as any[]).map(p => ({
          ...p,
          precio: Number(p.precio),
          precioOferta: p.precio_oferta != null
            ? Number(p.precio_oferta)
            : (p.precioOferta != null ? Number(p.precioOferta) : undefined)
        })) as Producto[];
        this.productos.set(productos);
      },
      error: (err) => console.error("Error al cargar productos:", err)
    });
  }

  esOferta(p: Producto): boolean {
    return p.precioOferta != null && p.precioOferta > 0 && p.precioOferta < p.precio;
  }

  imagenUrl(p: Producto): string {
    const nombre = p.imagen ?? p.img ?? "";
    if (!nombre) return "";
    if (nombre.startsWith("http")) return nombre;
    return this.carpetaImagenes + nombre;
  }

  formatoPrecio(valor: number | undefined): string {
    return Number(valor).toLocaleString("es-AR");
  }

  agregarCarrito(producto: Producto): void {
    this.carrito.agregar(producto.id, 1).subscribe({
      next: () => alert("Agregado al carrito"),
      error: (err) => {
        console.error("Error al agregar al carrito:", err);
        alert(err.status === 401
          ? "Iniciá sesión para agregar productos al carrito"
          : (err.error?.error ?? "No se pudo agregar al carrito"));
      }
    });
  }

  agregarFavoritos(producto: Producto): void {
    this.favoritoService.agregar(producto.id).subscribe({
      next: () => alert("Agregado a favoritos"),
      error: (err) => {
        console.error("Error al agregar a favoritos:", err);
        alert(err.status === 401
          ? "Iniciá sesión para guardar favoritos"
          : (err.error?.error ?? "No se pudo agregar a favoritos"));
      }
    });
  }
}
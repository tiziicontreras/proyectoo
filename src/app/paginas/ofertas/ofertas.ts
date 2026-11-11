
import { Component } from '@angular/core';
import { CarritoService } from '../../servicios/carrito.service';
import { FavoritoService } from '../../servicios/favoritoService';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-ofertas',
  imports: [],
  templateUrl: './ofertas.html',
  styleUrl: './ofertas.css',
})
export class Ofertas {

  constructor(
    private CarritoService: CarritoService,
    private FavoritoService: FavoritoService
  ) {}

  Productos: Producto[] = [
    {
      id: 1,
      nombre: "Nike Air Force 1 '07",
      disponibilidad: true,
      descripcion: "Zapatillas de Moda para Hombre",
      cantidad: 1,
      precio: 299999,
      precioOferta: 160999,
      img: "assets/157486-800-800.webp"
    },
    {
      id: 2,
      nombre: "Nike Pegasus Plus",
      disponibilidad: true,
      descripcion: "Zapatillas de Running para Hombre",
      precio: 369999,
      precioOferta: 258999,
      cantidad: 1,
      img: "assets/1140855-800-800.webp"
    },
    {
      id: 3,
      nombre: "Air Jordan 3 Retro",
      disponibilidad: true,
      descripcion: "Zapatillas Jordan para Hombre",
      precio: 314999,
      precioOferta: 220999,
      cantidad: 1,
      img: "assets/1531060-800-800 (1).webp"
    },
    {
      id: 4,
      nombre: "Air Jordan 1 Low",
      disponibilidad: true,
      descripcion: "Zapatillas Jordan para Hombre",
      precio: 259999,
      precioOferta: 194999,
      cantidad: 1,
      img: "assets/1504079-800-800.webp"
    },
    {
      id: 5,
      nombre: "Nike Elemental",
      disponibilidad: true,
      descripcion: "Mochila de Moda Unisex",
      precio: 99999,
      precioOferta: 69999,
      cantidad: 1,
      img: "assets/1292396-800-800.webp"
    },
    {
      id: 6,
      nombre: "Nike Air Max Dn",
      disponibilidad: true,
      descripcion: "Zapatillas de Moda para Hombre",
      precio: 369999,
      precioOferta: 258999,
      cantidad: 1,
      img: "assets/1363281-800-800.webp"
    }
  ];

  // AGREGAMOS AL CARRITO
  agregarCarrito(p: Producto): void {
    const productoOferta: Producto = {
      ...p,
      precio: p.precioOferta ?? p.precio
    };

    this.CarritoService.agregar(productoOferta.id, 1).subscribe(() => {
      alert("Agregado al carrito");
    });
  }

  // AGREGAMOS A FAVORITOS
  agregarFavoritos(p: Producto): void {
    const productoOferta: Producto = {
      ...p,
      precio: p.precioOferta ?? p.precio
    };

    this.FavoritoService.agregar(productoOferta.id).subscribe(() => {
      alert("Agregado a favoritos");
    });
  }
}

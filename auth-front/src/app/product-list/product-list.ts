import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';



import { ProductService } from '../services/product';
import { EditProductDialogComponent } from './edit-product-dialog.component';

export interface Product {
  _id?: string;  
  name: string;
  stock: number;
  price: number;
}


@Component({
  selector: 'table-pagination-example',
  styleUrl: 'product-list.scss',
  templateUrl: 'product-list.html',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule 
  ],
})
export class TablePaginationExample implements OnInit , AfterViewInit {
  private productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'price', 'stock', 'actions'];
  dataSource = new MatTableDataSource<Product>([])
  ;
  

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
  private router: Router
) {}

total = signal<number>(0);
pageSize = 10;
pageIndex = 0;

// (si tu as recherche/filters)
search= '';
minPrice: number | null = null;
maxPrice: number | null = null;
minStock: number | null = null;
maxStock: number | null = null;





applyFilters() {
  this.paginator.firstPage();
  this.loadPage(0, this.paginator.pageSize || this.pageSize);
}

resetFilters() {
  this.search = '';
  this.minPrice = null;
  this.maxPrice = null;
  this.minStock = null;
  this.maxStock = null;

  this.paginator.firstPage();
  this.loadPage(0, this.paginator.pageSize || this.pageSize);
}







loadPage(pageIndex = 0, pageSize = 10) {
  const page = pageIndex + 1; // API page commence à 1

  this.productService.listPaged({
    page,
    limit: pageSize,
    search: this.search,
    minPrice: this.minPrice,
    maxPrice: this.maxPrice,
    minStock: this.minStock,
    maxStock: this.maxStock,
  }).subscribe({
   next: (response) => {
  this.dataSource.data = response.items;
  this.total.set(response.total);

  this.pageSize = pageSize;
  this.pageIndex = pageIndex;

  this.paginator.length = this.total();
  this.paginator.pageIndex = this.pageIndex;
  this.paginator.pageSize = this.pageSize;
},

    error: () => {
      this.snack.open('Erreur chargement produits', 'OK', { duration: 2500 });
    }
  });
}


  ngOnInit(): void {
    this.loadPage();
  }


ngAfterViewInit() {
  // 1er chargement
  this.loadPage(0, this.paginator.pageSize || this.pageSize);

  // ✅ quand on change de page / pageSize
  this.paginator.page.subscribe(ev => {
    this.pageIndex = ev.pageIndex;
    this.loadPage(ev.pageIndex, ev.pageSize);
  });
}



  goToProfile(){
    this.router.navigateByUrl('/profile');
  }

  // ✅ DELETE (poubelle)
  deleteProduct(p: Product) {
    const id = (p._id) as string;
    if (!id) return;

    const ok = confirm(`Supprimer "${p.name}" ?`);
    if (!ok) return;

    this.productService.deleteById(id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(x => (x._id) !== id);
        this.snack.open('Produit supprimé ✅', 'OK', { duration: 2000 });
      },
      error: () => {
        this.snack.open('Suppression impossible ❌', 'OK', { duration: 2500 });
      }
    });
  }

  // ✅ EDIT (crayon) via Dialog
  editProduct(p: Product) {
    const oldName = p.name;

    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      width: '520px',
      data: { ...p, oldName },
    });

    dialogRef.afterClosed().subscribe((result?: any) => {
      if (!result) return;

      this.productService.updateByName(result.oldName, {
        name: result.name,
        price: Number(result.price),
        stock: Number(result.stock),
      }).subscribe({
        next: (updated) => {
          const id = (p._id );
          // remplace la ligne modifiée
          this.dataSource.data = this.dataSource.data.map(x => {
            const xid = (x._id);
            return xid === id ? { ...x, ...updated } : x;
          });
          this.snack.open('Produit modifié ✅', 'OK', { duration: 2000 });
        },
        error: () => {
          this.snack.open('Modification impossible ❌', 'OK', { duration: 2500 });
        }
      });
    });
  }
  

  addProduct() {
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      width: '520px',
      data: null, // pas de data = mode ajout
    });

    dialogRef.afterClosed().subscribe((result?: any) => {
      if (!result) return;

      this.productService.create({
        name: result.name,
        price: Number(result.price),
        stock: Number(result.stock),
      }).subscribe({
        next: (created: Product) => {
          this.dataSource.data = [created, ...this.dataSource.data];
          this.snack.open('Produit ajouté ✅', 'OK', { duration: 2000 });
        },
        error: () => {
          this.snack.open('Ajout impossible ❌', 'OK', { duration: 2500 });
        }
      });
    });
  }
  

}

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../../../../core/services/products.service';
import { Product } from './interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ProductsDialogComponent } from './products-dialog/products-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Product>();
  displayedColumns: string[] = [
    'id',
    'productImage',
    'productName',
    'productCategory',
    'productPrice',
    'productCreatedAt',
    'productStock',
    'productDescription',
    'productActions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private productsService: ProductsService,
    public matDialog: MatDialog,
  ) {
    this.loadProducts();
  }

  ngOnInit(): void {
    
  }

  loadProducts() {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.dataSource.data = products;
      },
      
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.matDialog
      .open(ProductsDialogComponent, {
        enterAnimationDuration,
        exitAnimationDuration,
      })
      .afterClosed()
      .subscribe({
        next: (result) => {
          if (result) {
            this.productsService.createProduct(result).subscribe({
              next: (product) => {
                this.dataSource.data = product;
              },
              complete: () => {
                alert('Se agrego el producto');
              },
            });
          }
        },
      });
  }

  onDeleteProduct(data: string): void {
    this.productsService.deleteProduct(data).subscribe({
      next: (result) => {
        this.dataSource.data = result;
      },
      complete: () => {
        alert('Se elimino el producto');
      },
    });
  }
}

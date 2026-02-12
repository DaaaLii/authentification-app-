import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 class="text-xl font-semibold mb-4">
      {{ isEditMode ? 'Modifier produit' : 'Ajouter produit' }}
    </h2>

    <div class="grid gap-4">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Nom</mat-label>
        <input matInput [(ngModel)]="product.name" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Prix</mat-label>
        <input matInput type="number" [(ngModel)]="product.price" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Stock</mat-label>
        <input matInput type="number" [(ngModel)]="product.stock" />
      </mat-form-field>
    </div>

    <div class="mt-5 flex justify-end gap-2">
      <button mat-button (click)="close()">Annuler</button>
      <button mat-raised-button color="primary"
              (click)="save()"
              [disabled]="!product.name">
        {{ isEditMode ? 'Enregistrer' : 'Ajouter' }}
      </button>
    </div>
  `
})
export class EditProductDialogComponent {

  product: any;
  isEditMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<EditProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data; // si data existe → édition

    this.product = data
      ? { ...data } // édition
      : { name: '', price: 0, stock: 0 }; // ajout
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.product);
  }
}

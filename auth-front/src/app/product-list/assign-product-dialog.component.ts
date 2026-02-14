import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface UserMini {
  _id: string;
  name: string;
  email: string;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Assigner produit</h2>

    <mat-dialog-content class="pt-2">
      <div class="grid gap-3">
        <div><b>Produit:</b> {{ data.productName }}</div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Utilisateur</mat-label>
          <mat-select [formControl]="form.controls.userId" required>
            <mat-option *ngFor="let u of data.users" [value]="u._id">
              {{ u.name }} — {{ u.email }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Stock à assigner</mat-label>
          <input matInput type="number" [formControl]="form.controls.stock" />
        </mat-form-field>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="close()">Annuler</button>
      <button mat-raised-button color="primary" type="button" (click)="save()" [disabled]="form.invalid">
        Enregistrer
      </button>
    </mat-dialog-actions>
  `,
})
export class AssignProductDialogComponent {
  dialogRef = inject(MatDialogRef<AssignProductDialogComponent>);
  data = inject(MAT_DIALOG_DATA) as { productName: string; users: UserMini[] };

  form = new FormGroup({
    userId: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    stock: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
  });

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close({
      userId: this.form.value.userId,
      stock: Number(this.form.value.stock),
    });
  }
}

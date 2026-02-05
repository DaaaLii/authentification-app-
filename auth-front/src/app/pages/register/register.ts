import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-shell">
      <div class="auth-card">
        <div class="header">
          <h2>Créer un compte</h2>
          <p>Ajoute un avatar (optionnel) et crée ton compte.</p>
        </div>

        <!-- Avatar picker -->
        <div class="avatar-box">
          <div class="avatar-preview">
            <img *ngIf="avatarPreview; else fallback" [src]="avatarPreview" alt="Avatar preview" />
            <ng-template #fallback>
              <div class="avatar-fallback">{{ initial }}</div>
            </ng-template>
          </div>

          <div class="avatar-actions">
            <label class="file-btn">
              Choisir une image
              <input type="file" accept="image/*" (change)="onFileSelected($event)" />
            </label>

            <button class="btn-ghost" type="button" (click)="removeAvatar()" [disabled]="!avatarPreview">
              Supprimer
            </button>

            <small class="hint">PNG/JPG • recommandé: carré • max ~1-2MB</small>
          </div>
        </div>

        <input class="input" [(ngModel)]="name" placeholder="Name" />
        <input class="input" [(ngModel)]="email" placeholder="Email" />
        <input class="input" [(ngModel)]="password" type="password" placeholder="Password (6+)" />

        <button class="btn-primary" (click)="submit()" [disabled]="loading || !email || password.length < 6">
          {{ loading ? 'Création...' : 'Créer le compte' }}
        </button>

        <p class="link" (click)="goLogin()">J’ai déjà un compte</p>
        <p class="err" *ngIf="error">{{ error }}</p>
      </div>
    </div>
  `,
  styles: [`
    :host{ display:block; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
    .auth-shell{ min-height:100dvh; display:grid; place-items:center; padding:24px; background:#f6f7fb; }
    .auth-card{ width:100%; max-width:520px; background:#fff; border:1px solid #e4e7ec; border-radius:18px; padding:22px; box-shadow:0 18px 55px rgba(16,24,40,.10); }
    .header h2{ margin:0 0 6px; font-size:28px; }
    .header p{ margin:0 0 14px; color:#667085; font-size:14px; }

    .avatar-box{ display:flex; gap:14px; align-items:center; padding:12px; border:1px solid #e4e7ec; border-radius:16px; background:#fff; margin-bottom:14px; }
    .avatar-preview{ width:64px; height:64px; border-radius:16px; overflow:hidden; border:1px solid rgba(37,99,235,.18); background:rgba(37,99,235,.08); display:grid; place-items:center; flex:0 0 auto; }
    .avatar-preview img{ width:100%; height:100%; object-fit:cover; display:block; }
    .avatar-fallback{ font-weight:900; color:#1d4ed8; font-size:22px; }

    .avatar-actions{ display:grid; gap:8px; width:100%; }
    .file-btn{
      display:inline-flex; align-items:center; justify-content:center;
      height:40px; padding:0 12px; border-radius:12px;
      background:#2563eb; color:#fff; font-weight:800; cursor:pointer;
      width:fit-content;
    }
    .file-btn input{ display:none; }

    .btn-ghost{
      height:40px; padding:0 12px; border-radius:12px; border:1px solid #e4e7ec; background:#fff; cursor:pointer; font-weight:800;
      width:fit-content;
    }
    .btn-ghost:disabled{ opacity:.6; cursor:not-allowed; }

    .hint{ color:#667085; font-size:12px; }

    .input{ width:100%; padding:12px; margin:8px 0; border-radius:12px; border:1px solid #d0d5dd; outline:none; }
    .input:focus{ border-color:rgba(37,99,235,.65); box-shadow:0 0 0 4px rgba(37,99,235,.14); }

    .btn-primary{ width:100%; padding:12px; border-radius:12px; border:none; cursor:pointer; background:#2563eb; color:#fff; font-weight:900; margin-top:8px; }
    .btn-primary:disabled{ opacity:.7; cursor:not-allowed; }

    .link{ cursor:pointer; text-decoration:underline; margin-top:10px; font-weight:700; }
    .err{ color:#b00020; margin-top:10px; }
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  avatarBase64: string | null = null;
  avatarPreview: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  get initial(): string {
    const base = (this.name || this.email || 'U').trim();
    return base ? base[0].toUpperCase() : 'U';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // petit garde-fou
    if (!file.type.startsWith('image/')) {
      this.error = 'Veuillez choisir une image.';
      return;
    }
    if (file.size > 2_000_000) {
      this.error = 'Image trop grande (max ~2MB).';
      return;
    }

    this.error = '';

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.avatarBase64 = result;      // ✅ à envoyer au backend
      this.avatarPreview = result;     // ✅ preview immédiate
    };
    reader.readAsDataURL(file);

    // permet de re-sélectionner le même fichier
    input.value = '';
  }

  removeAvatar() {
    this.avatarBase64 = null;
    this.avatarPreview = null;
  }

  submit() {
    this.error = '';
    if (!this.email || this.password.length < 6) return;

    this.loading = true;

    this.auth.register({
      name: this.name,
      email: this.email,
      password: this.password,
      avatar: this.avatarBase64, // ✅ NEW
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/profile');
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.message || 'Erreur register';
      }
    });
  }

  goLogin() {
    this.router.navigateByUrl('/login');
  }
}

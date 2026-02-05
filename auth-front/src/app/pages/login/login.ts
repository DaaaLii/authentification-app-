import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-shell">
      <div class="auth-card">
        <div class="header">
          <h2>Connexion</h2>
          <p>Accède à ton espace en quelques secondes.</p>
        </div>

        <div class="form">
          <label class="label">Email</label>
          <input
            class="input"
            [(ngModel)]="email"
            placeholder="ex: you@mail.com"
            type="email"
            autocomplete="email"
          />

          <label class="label">Mot de passe</label>
          <div class="password-row">
            <input
              class="input"
              [(ngModel)]="password"
              [type]="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
            />
            <button class="icon-btn" type="button" (click)="showPassword = !showPassword" [attr.aria-label]="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'">
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>

          <button class="btn btn-primary" (click)="submit()" [disabled]="loading || !email || !password">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>

          <div class="alert alert-danger" *ngIf="error">{{ error }}</div>

          <div class="footer">
            <span>Pas de compte ?</span>
            <button class="link" type="button" (click)="goRegister()">Créer un compte</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host{
      --bg:#f6f7fb; --card:#fff; --text:#101828; --muted:#667085;
      --border:#e4e7ec; --border2:#d0d5dd;
      --primary:#2563eb; --primary2:#1d4ed8;
      --danger:#dc2626;
      --shadow: 0 14px 40px rgba(16,24,40,.10);
      --ring: 0 0 0 4px rgba(37,99,235,.16);
      --ringDanger: 0 0 0 4px rgba(220,38,38,.14);
      display:block;
    }

    .auth-shell{
      min-height: 100dvh;
      display:grid;
      place-items:center;
      padding: 24px;
      background:
        radial-gradient(1200px 500px at 20% 0%, #eef2ff 0%, transparent 55%),
        radial-gradient(900px 400px at 100% 10%, #eff6ff 0%, transparent 55%),
        var(--bg);
    }

    .auth-card{
      width:100%;
      max-width: 520px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 18px;
      box-shadow: var(--shadow);
      padding: 26px;
    }

    .header h2{
      margin: 0 0 6px;
      font-size: 30px;
      letter-spacing: -0.02em;
      color: var(--text);
    }
    .header p{
      margin:0 0 18px;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.4;
    }

    .form{ display:grid; gap: 10px; }

    .label{
      font-size: 13px;
      color: var(--muted);
      margin-top: 2px;
    }

    .input{
      width:100%;
      height: 46px;
      padding: 0 14px;
      border-radius: 12px;
      border: 1px solid var(--border2);
      outline:none;
      transition: box-shadow .15s ease, border-color .15s ease, transform .05s ease;
      background:#fff;
      color: var(--text);
    }
    .input:focus{
      border-color: rgba(37,99,235,.65);
      box-shadow: var(--ring);
    }

    .password-row{
      position: relative;
      display:flex;
      gap: 10px;
      align-items:center;
    }
    .password-row .input{ flex:1; }

    .icon-btn{
      height: 46px;
      width: 52px;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: #fff;
      cursor:pointer;
      transition: background .15s ease, transform .05s ease;
    }
    .icon-btn:hover{ background: rgba(16,24,40,.03); }
    .icon-btn:active{ transform: translateY(1px); }

    .btn{
      height: 46px;
      border-radius: 12px;
      border: 1px solid transparent;
      font-weight: 700;
      cursor:pointer;
      transition: transform .05s ease, background .15s ease, opacity .15s ease;
      margin-top: 6px;
    }
    .btn:active{ transform: translateY(1px); }

    .btn-primary{
      background: var(--primary);
      color:#fff;
    }
    .btn-primary:hover{ background: var(--primary2); }
    .btn:disabled{
      opacity:.7;
      cursor:not-allowed;
    }

    .alert{
      border-radius: 12px;
      padding: 12px;
      border: 1px solid var(--border);
      background: #f9fafb;
      font-size: 14px;
      line-height: 1.35;
      margin-top: 6px;
    }
    .alert-danger{
      border-color: rgba(220,38,38,.25);
      background: rgba(220,38,38,.06);
      color: #991b1b;
      box-shadow: var(--ringDanger);
    }

    .footer{
      margin-top: 6px;
      display:flex;
      gap: 8px;
      align-items:center;
      justify-content:center;
      color: var(--muted);
      font-size: 14px;
    }

    .link{
      border:none;
      background: transparent;
      color: var(--primary);
      font-weight: 700;
      cursor:pointer;
      padding: 0;
    }
    .link:hover{ text-decoration: underline; }

    @media (max-width: 420px){
      .auth-card{ padding: 18px; border-radius: 16px; }
      .header h2{ font-size: 26px; }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (!this.email || !this.password) return;

    this.error = '';
    this.loading = true;

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access_token || '');
        console.log(localStorage.getItem('token'));
        console.log(res);
        this.loading = false;
        this.router.navigateByUrl('/profile');
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.message || 'Erreur login';
      }
    });
  }

  goRegister() {
    this.router.navigateByUrl('/register');
  }
}

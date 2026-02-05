import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styles: [`
    :host{
      --bg:#f6f7fb;
      --card:#ffffff;
      --text:#101828;
      --muted:#667085;

      --border:#e4e7ec;
      --shadow: 0 18px 55px rgba(16,24,40,.10);

      --primary:#2563eb;
      --primary2:#1d4ed8;

      --danger:#dc2626;

      --ring: 0 0 0 4px rgba(37,99,235,.14);
      display:block;
      color: var(--text);
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    }

    .shell{
      min-height: 100dvh;
      padding: 28px;
      background:
        radial-gradient(1200px 520px at 18% 0%, #eef2ff 0%, transparent 55%),
        radial-gradient(900px 420px at 100% 10%, #eff6ff 0%, transparent 55%),
        var(--bg);
    }

    .container{
      max-width: 980px;
      margin: 0 auto;
      display: grid;
      gap: 16px;
    }

    .topbar{
      display:flex;
      align-items:flex-start;
      justify-content: space-between;
      gap: 14px;
    }

    .title{
      margin: 0;
      font-size: 34px;
      letter-spacing: -0.02em;
      line-height: 1.1;
    }

    .subtitle{
      margin: 6px 0 0;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.4;
    }

    .actions{
      display:flex;
      gap: 10px;
      align-items:center;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .btn{
      height: 42px;
      padding: 0 14px;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: #fff;
      cursor: pointer;
      font-weight: 750;
      transition: transform .05s ease, background .15s ease, border-color .15s ease, box-shadow .15s ease;
      user-select:none;
    }
    .btn:hover{ background: rgba(16,24,40,.03); }
    .btn:active{ transform: translateY(1px); }
    .btn:focus{ outline:none; box-shadow: var(--ring); }

    .btn-primary{
      background: var(--primary);
      border-color: transparent;
      color: #fff;
    }
    .btn-primary:hover{ background: var(--primary2); }

    .btn-danger{
      background: rgba(220,38,38,.08);
      border-color: rgba(220,38,38,.20);
      color: #991b1b;
    }
    .btn-danger:hover{ background: rgba(220,38,38,.12); }

    .card{
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 18px;
      box-shadow: var(--shadow);
    }

    .hero{
      padding: 18px;
      display:flex;
      gap: 16px;
      align-items:center;
    }

    .avatar{
      width: 58px;
      height: 58px;
      border-radius: 16px;
      display:grid;
      place-items:center;
      font-weight: 900;
      letter-spacing: -0.02em;
      color: #1d4ed8;
      background:
        radial-gradient(60px 60px at 20% 20%, rgba(37,99,235,.22) 0%, transparent 60%),
        rgba(37,99,235,.10);
      border: 1px solid rgba(37,99,235,.18);
      flex: 0 0 auto;

      overflow: hidden; /* ✅ pour que l'image soit bien “crop” */
    }
    .avatar img{
      width:100%;
      height:100%;
      object-fit:cover;
      display:block;
    }

    .hero-meta{
      min-width: 0;
      display:grid;
      gap: 2px;
    }

    .name{
      font-size: 18px;
      font-weight: 850;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .email{
      margin: 0;
      color: var(--muted);
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status-pill{
      margin-left: auto;
      height: 30px;
      padding: 0 10px;
      border-radius: 999px;
      border: 1px solid rgba(22,163,74,.20);
      background: rgba(22,163,74,.08);
      color: #166534;
      display:flex;
      align-items:center;
      gap: 6px;
      font-weight: 800;
      font-size: 12px;
      white-space: nowrap;
    }

    .grid{
      display:grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      padding: 12px;
    }

    .info{
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 14px;
      background: #fff;
      display:grid;
      gap: 8px;
      min-height: 96px;
    }

    .k{
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: .02em;
      text-transform: uppercase;
    }

    .v{
      font-weight: 850;
      color: var(--text);
      overflow-wrap: anywhere;
      line-height: 1.25;
    }

    .row-actions{
      display:flex;
      gap: 10px;
      justify-content: flex-end;
      padding: 0 12px 12px;
    }

    .hint{
      color: var(--muted);
      font-size: 13px;
      padding: 0 12px 14px;
    }

    .toast{
      margin-left: auto;
      color: #166534;
      font-weight: 800;
      font-size: 13px;
      align-self: center;
    }

    /* Skeleton */
    .skeleton{
      animation: shine 1.15s linear infinite;
      background: linear-gradient(90deg, #eef2ff 0%, #f5f7ff 50%, #eef2ff 100%);
      background-size: 200% 100%;
      border-radius: 12px;
    }
    .sk-line{ height: 14px; width: 220px; }
    .sk-chip{ height: 30px; width: 92px; border-radius: 999px; }
    .sk-box{ height: 96px; width: 100%; border-radius: 16px; }
    @keyframes shine{ to { background-position: -200% 0; } }

    /* Responsive */
    @media (max-width: 900px){
      .grid{ grid-template-columns: 1fr; }
      .status-pill{ margin-left: 0; }
      .hero{ align-items:flex-start; }
    }
    @media (max-width: 520px){
      .shell{ padding: 18px; }
      .title{ font-size: 28px; }
      .actions{ width: 100%; justify-content: stretch; }
      .btn{ width: 100%; }
      .hero{ flex-direction: column; align-items:flex-start; }
      .status-pill{ align-self: flex-start; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading = true;

  copied = false;
  copyTimer: any = null;

  constructor(
    private auth: AuthService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // ✅ Source unique de vérité : AuthService -> clé "token"
   

   
    this.loading = true;

    this.auth.me().subscribe({
      next: (u) => {
        this.user = u;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        this.loading = false;

        // ✅ si non autorisé => session invalide => logout + login
        if (e?.status === 401 || e?.status === 403) {
          this.auth.logout();
          this.router.navigateByUrl('/login');
          return;
        }

        // autre erreur
        this.user = null;
        this.cdr.detectChanges();
      }
    });
  }

  get displayName(): string {
    const name = (this.user?.name || '').trim();
    if (name) return name;
    const email = (this.user?.email || '').trim();
    if (email) return email.split('@')[0];
    return 'Utilisateur';
  }

  get initial(): string {
    const s = (this.displayName || 'U').trim();
    return s ? s[0].toUpperCase() : 'U';
  }

  async copyId() {
    const id = this.user?.id;
    if (!id) return;

    try {
      await navigator.clipboard.writeText(String(id));
      this.copied = true;

      clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => {
        this.copied = false;
        this.cdr.detectChanges();
      }, 1400);

      this.cdr.detectChanges();
    } catch {
      this.copied = false;
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}

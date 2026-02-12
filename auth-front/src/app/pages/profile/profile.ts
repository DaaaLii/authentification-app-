import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { environment } from '../../../environments/environment';


import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDividerModule],
  templateUrl: './profile.html',
  

})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading = true;

  copied = false;
  copyTimer: any = null;
  avatar: string | null = null;
  avatarBase64: string | null = null;
  avatarPreview: string | null = null;

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
        if (u.avatar){
         this.avatar = `${environment.apiUrl}/${u.avatar}?t=${Date.now()}`;
         console.log('User avatar URL:', this.avatar);
        }
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
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
  goToProducts() {
  this.router.navigateByUrl('/productlist');
}

  onAvatarSelected(event: Event) {
    console.log('Avatar file selected');
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  // (Optionnel) validation rapide
  if (!file.type.startsWith('image/')) return;
  if (file.size > 3 * 1024 * 1024) return; // 3MB par ex

  // ✅ Preview immédiat
  const reader = new FileReader();
  reader.onload = () => {
    this.user = { ...this.user, avatar: String(reader.result) };
  };
  reader.readAsDataURL(file);

  // ✅ Upload vers API
  this.auth.uploadAvatar(file).subscribe({
    next: (res) => {
      // Selon ta réponse backend, ex: res.url
      this.avatar = `${environment.apiUrl}/${res.path}?t=${Date.now()}`;
      console.log('Avatar uploaded successfully:', this.avatar);
      this.cdr.detectChanges();
    },
    error: () => {
      // optionnel: revert / toast
    }
  });

  



  // permet de re-sélectionner le même fichier
  input.value = '';
}

}

import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
class PermissionsService {

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    try {
      const authenticated = await this.accountService.isLoggedIn();
      if (!authenticated) {
        this.router.navigate(['/login']);
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
  return inject(PermissionsService).canActivate();
}

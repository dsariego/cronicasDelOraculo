import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const usersGuard: CanActivateFn = (route, state) => {
  const _userService = inject(UserService);
  const _router = inject(Router);
  if(_userService.userObject()?.name && _userService.userObject()?.password && _userService.userObject()?.role) return true;
  const rute = _router.parseUrl("/adventure");
  return new RedirectCommand(rute, {skipLocationChange: true});
};

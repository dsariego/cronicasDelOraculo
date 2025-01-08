import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserRole } from '../../models/commons.module';
import { CommonsService } from '../../services/commons.service';
import { OptionsTemplateComponent } from '../../components/options-template/options-template.component';
import { HermitTemplateComponent } from '../../components/hermit-template/hermit-template.component';
import { RecordTemplateComponent } from '../../components/record-template/record-template.component';
import { ConstantsService } from '../../services/constants.service';

@Component({
  selector: 'app-adventure',
  standalone: true,
  imports: [CommonModule, FormsModule, HermitTemplateComponent],
  templateUrl: './adventure.component.html',
  styleUrl: './adventure.component.scss'
})
export class AdventureComponent {
  _constants = inject(ConstantsService);
  _services = inject(CommonsService);
  _userService = inject(UserService);
  _router = inject(Router);

  userNeedHelp: boolean = true;

  constructor(private _user: UserService) {}

  ngOnInit(): void {
    this.userNeedHelp = this._user._constants.isHelpChecked;
  }

  changeName(newName: string, newPass: string){
    const currentUserObject = this._userService.userObject();
    this._userService.userObject.set({
      ...currentUserObject,
      name: newName,
      password: newPass,
      role: UserRole.REGISTERED,
      needHelp: true,
      needSounds: true
    });
    this._router.navigate(['/']);
  }

  logout() {
    this._userService.logout();
  }
}

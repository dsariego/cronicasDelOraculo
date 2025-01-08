import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonsService } from '../../services/commons.service';
import { UserService } from '../../services/user.service';
import { ConstantsService } from '../../services/constants.service';
import { OptionsTemplateComponent } from '../../components/options-template/options-template.component';
import { FormsModule } from '@angular/forms';
import { HermitTemplateComponent } from '../../components/hermit-template/hermit-template.component';
import { RecordTemplateComponent } from '../../components/record-template/record-template.component';

@Component({
  selector: 'app-chronicles',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, OptionsTemplateComponent, FormsModule, HermitTemplateComponent, RecordTemplateComponent],
  templateUrl: './chronicles.component.html',
  styleUrl: './chronicles.component.scss'
})
export class ChroniclesComponent {
  _constants = inject(ConstantsService);
  _services = inject(CommonsService);
  _userService = inject(UserService)

  userNeedHelp: boolean = true;

  constructor(private _user: UserService) {}

  ngOnInit(): void {
    this.userNeedHelp = this._user._constants.isHelpChecked;
  }

}

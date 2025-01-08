import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ConstantsService } from '../../services/constants.service';
import { OptionsTemplateComponent } from '../../components/options-template/options-template.component';
import { FormsModule } from '@angular/forms';
import { CommonsService } from '../../services/commons.service';
import { HermitTemplateComponent } from "../../components/hermit-template/hermit-template.component";

@Component({
  selector: 'app-catacombs',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, OptionsTemplateComponent, FormsModule, HermitTemplateComponent],
  templateUrl: './catacombs.component.html',
  styleUrl: './catacombs.component.scss'
})
export class CatacombsComponent implements OnInit {

  _constants = inject(ConstantsService);
  _services = inject(CommonsService);

  userNeedHelp: boolean = true;

  constructor(private _user: UserService) {}

  ngOnInit(): void {
    this.userNeedHelp = this._user._constants.isHelpChecked;
  }
}

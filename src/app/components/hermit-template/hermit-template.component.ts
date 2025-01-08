import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ConstantsService } from '../../services/constants.service';
import { CommonsService } from '../../services/commons.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hermit-template',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FormsModule],
  templateUrl: './hermit-template.component.html',
  styleUrl: './hermit-template.component.scss'
})
export class HermitTemplateComponent implements OnInit {
  @Input() itemName: string = '';
  @Input() separatorColor: string = '#DAA520';
  @Input() tooltipMessage: string = '';
  _constants = inject(ConstantsService);
  _services = inject(CommonsService);

  userNeedHelp?: boolean;
  userNeedSounds?: boolean;

  constructor(private _user: UserService) {}

  ngOnInit(): void {
    this.userNeedHelp = this._user.getUserObject()?.needHelp ?? true;
    this.userNeedSounds = this._user.getUserObject()?.needSounds ?? true;
    this._constants.isHelpChecked = this._user.getUserObject()?.needHelp ?? true;
    this._constants.isSoundsChecked = this._user.getUserObject()?.needSounds ?? true;
  }

  onSwitchChange(service: string): void {
    this._user.onSwitchChange(service);
  }

  onItemClickItem() {
    this._services.playClickSoundItem();
  }
}

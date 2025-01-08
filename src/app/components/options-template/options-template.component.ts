import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonsService } from '../../services/commons.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ConstantsService } from '../../services/constants.service';

@Component({
  selector: 'app-options-template',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './options-template.component.html',
  styleUrl: './options-template.component.scss'
})
export class OptionsTemplateComponent implements OnInit, OnChanges {
  @Input() menuItems: any[] = [];
  @Input() itemName: string = '';
  @Input() separatorColor: string = '#DAA520';
  @Input() optionalImageUrl?: string;

  label: string | null = '';

  hoveredItem: any = null;
  popupTop: number = 0;
  popupLeft: number = 0;
  imageUrl: string = '';
  altText: string = '';

  private _commonsService = inject(CommonsService);
  _constants = inject(ConstantsService);
  private _userService = inject(UserService);
  private _router = inject(Router);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.updateImageData();
    this.route.queryParams.subscribe(params => {
      this.label = params['label'];
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemName']) {
      this.updateImageData();
    }
  }

  onMouseEnter(item: any, event: MouseEvent) {
    this.hoveredItem = item;
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.popupTop = rect.bottom + window.scrollY;
    //this.popupLeft = rect.left + window.scrollX;
    this.popupLeft = rect.left + (rect.width / 2) + window.scrollX - 100;
    this._commonsService.playHoverSound();
  }

  onMouseLeave() {
    this.hoveredItem = null;
  }

  onItemClick() {
    this.hoveredItem = null;
    this._commonsService.playClickSound();
  }

  navegate(item: string, context: string): void {
    this.hoveredItem = null;
    this._commonsService.playClickSound();
    //this._router.navigate([`/`+context, item]);
  }

  get canAccess() {
    return this._userService.userObject()?.role;
  }

  private updateImageData(): void {
    this.imageUrl = "assets/images/cover_" +this.itemName+ "_web.webp";
    this.altText = this._commonsService.convertItemName(this.itemName);
  }

}

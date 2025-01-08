import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserService } from './services/user.service';
import { CommonsService } from './services/commons.service';
import { ConstantsService } from './services/constants.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'cronicas-del-oraculo';
  breadcrumbLinks: { label: string, url: string }[] = [];
  currentRoute!: string;
  isSpanish: boolean = true;
  badgeCount: number = 5;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object){}

  _userService = inject(UserService);
  private _commonsService = inject(CommonsService);
  _constants = inject(ConstantsService);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const lang = document.documentElement.lang;
      this.isSpanish = lang === 'es';
    }
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.generateBreadcrumbs();
        this.scrollToTop();
      });
  }

  private generateBreadcrumbs(): void {
    this.breadcrumbLinks = [{ label: 'Crónicas del Oráculo', url: '/' }];
    const segments = this.currentRoute.split('/').filter(segment => segment);
    let urlAccumulator = '';
    segments.forEach((segment, index) => {
      const freeSegment: string = this.formatSegmentLabel(segment, false);
      if(!urlAccumulator){
        urlAccumulator += `${freeSegment}`;
      }else{
        urlAccumulator += `/${freeSegment}`;
      }
      this.breadcrumbLinks.push({
        label: this.formatSegmentLabel(segment, this.isSpanish),
        url: urlAccumulator
      });
    });
  }

  //Efecto deslizamiento suave con cambio de página
  private scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onMouseEnter(event: MouseEvent) {
    this._commonsService.playHoverSound();
  }

  onItemClick() {
    this._commonsService.playClickSound();
  }

  onItemClickItem() {
    this._commonsService.playClickSoundItem();
  }

  private formatSegmentLabel(segment: string, language: boolean): string {
    //Futuro hacer metadata para esta transcripción
    if(language){
      return segment
      .replace(/-/g, ' ')
      .replace(/\?.*$/, '')
      .replace(/\s+/g, '')
      .replace(/\b\w/g, char => char.toUpperCase())
      .replace(/Chronicles/g, 'Crónicas')
      .replace(/Forging/g, 'Forja')
      .replace(/Catacombs/g, 'Catacumbas')
      .replace(/Codex/g, 'Códice')
      .replace(/Grimoire/g, 'Grimorio')
      .replace(/Oracle/g, 'Oráculo')
      .replace(/Adventure/g, 'Aventurero')
      .replace(/Characters/g, 'Personajes')
      .replace(/Equipment/g, 'Equipo')
      .replace(/Armory/g, 'Armería')
      .replace(/Relics/g, 'Reliquias')
      .replace(/Bestiary/g, 'Bestiario')
      .replace(/Feats/g, 'Hazañas')
      .replace(/Saga/g, 'Sagas')
      .replace(/Conclave/g, 'Cónclave')
      .replace(/TheFeat/g, 'Capítulo')
      .replace(/TheSagas/g, 'Acto')
      .replace(/Detail/g, '');
    }else{
      return segment
      .replace(/-/g, ' ')
      .replace(/\?.*$/, '')
      .replace(/detail/g, '')
      .replace(/\s+/g, '');
    }
  }

  isHomePage(): boolean{
    return this.currentRoute === '/';
  }

}

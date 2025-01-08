import { Component, inject, OnInit } from '@angular/core';
import { HermitTemplateComponent } from '../../components/hermit-template/hermit-template.component';
import { ConstantsService } from '../../services/constants.service';
import { ItemTemplateComponent } from '../../components/item-template/item-template.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [HermitTemplateComponent, ItemTemplateComponent],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit{
  label: string | null = '';
  routeSegment: string | undefined;
  _constants = inject(ConstantsService);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.label = params['label'];
    });
    const segments = this.route.snapshot.url;
    if (segments.length > 0) {
      this.routeSegment = segments[segments.length - 1].path;
    }
  }

}

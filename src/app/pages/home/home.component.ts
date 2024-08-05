import { Component, OnInit } from '@angular/core';
import {} from '@angular/common/http';
import { DynamicContentService } from 'src/app/services/dynamic-content/dynamic-content.service';
import { DynamicPage } from '../../models/dynamic-page.model';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
HttpClientModule],
  providers: [DynamicContentService],
})
export class HomeComponent implements OnInit {
  public pages: DynamicPage[] = [];
  public categories: string[] = [];

  constructor(private dynamicContentService: DynamicContentService) {}

  public ngOnInit(): void {
    this.dynamicContentService.getPages();

    this.dynamicContentService.pages$.subscribe((pages) => {
      this.pages = pages;
      this.categories = this.pages.map((page) => page.category);

      console.log('### CATEGORIES', this.categories);
      console.log('### PAGES', this.pages);
    });
  }
}

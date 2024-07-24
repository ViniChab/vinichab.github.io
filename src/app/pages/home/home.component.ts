import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [HttpClientModule],
})
export class HomeComponent implements OnInit {
  private pagesUrl = '/assets/pages';
  public pages: { title: string; content: string }[] = [];

  constructor(private http: HttpClient) {}

  public ngOnInit(): void {
    this.getPages(1);
  }

  private getPages(index: number): void {
    this.http
      .get<{ title: string; content: string }>(`${this.pagesUrl}/${index}.json`)
      .subscribe(
        (page) => {
          this.pages.push(page);
          this.getPages(index + 1);
        },
        (err) => this.onPagesLoaded()
      );
  }

  private onPagesLoaded(): void {
    console.log('### PAGES LOADED', this.pages);
  }
}

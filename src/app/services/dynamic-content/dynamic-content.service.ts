import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DynamicPage } from '../../models/dynamic-page.model';

@Injectable()
export class DynamicContentService {
  private pagesUrl = 'assets/pages';
  private pages: DynamicPage[] = [];
  public pages$ = new Subject<DynamicPage[]>();

  constructor(private http: HttpClient) {}

  public getPages(index: number = 0): void {
    this.http.get<DynamicPage>(`${this.pagesUrl}/${index}.json`).subscribe(
      (page) => {
        this.pages.push(page);
        this.getPages(index + 1);
      },
      (error) => {
        this.pages$.next(this.pages);
      }
    );
  }
}

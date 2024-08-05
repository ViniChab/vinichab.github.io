import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DynamicContentService } from 'src/app/services/dynamic-content/dynamic-content.service';
import { DynamicPage } from '../../models/dynamic-page.model';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [HttpClientModule],
  providers: [DynamicContentService],
})
export class HomeComponent implements AfterContentInit {
  @ViewChild('pageIframe') pageIframe!: ElementRef<HTMLIFrameElement>;
  public pages: DynamicPage[] = [];
  public categories: string[] = [];
  public loadUrl?: SafeResourceUrl;

  constructor(
    private dynamicContentService: DynamicContentService,
    private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  public ngAfterContentInit(): void {
    this.dynamicContentService.getPages();

    this.dynamicContentService.pages$.subscribe((pages) => {
      this.pages = pages;
      this.categories = this.pages.map((page) => page.category);
      this.checkActivatedRoute();
    });
  }

  private checkActivatedRoute(): void {
    const currentUrl: UrlSegment[] = this.activatedRoute.snapshot.url;
    const pageNumber = currentUrl.join('/');

    if (pageNumber?.length && this.pages[+pageNumber]) {
      this.loadUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
        `assets/pages/${currentUrl?.join('/')}.html`
      );

      this.fixIframeHeight();
    }
  }

  /*
   * Nasty hack, wouldn't do this under normal circumstances
   * But this is a small personal blog, it's meant to be quite simple
   * This is a good enough solution
   * Don't copy this, kids
   */
  private fixIframeHeight(): void {
    this.cdr.detectChanges();

    setTimeout(() => {
      this.pageIframe.nativeElement.style.height =
        this.pageIframe.nativeElement.contentWindow!.document.body
          .scrollHeight + 'px';
    }, 100);
  }
}

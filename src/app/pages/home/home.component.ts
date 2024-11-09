import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DynamicPage } from '../../models/dynamic-page.model';
import { ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { interval, take } from 'rxjs';
import { EmbeddedContentComponent } from '../embedded-content/embedded-content.component';
import { BackgroundService, DynamicContentService } from 'src/app/services';
import { CommonModule } from '@angular/common';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [HttpClientModule, EmbeddedContentComponent, CommonModule],
  providers: [DynamicContentService],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('pageIframe') pageIframe!: ElementRef<HTMLIFrameElement>;
  public pages: DynamicPage[] = [];
  public categories: string[] = [];
  public loadUrl?: SafeResourceUrl;

  constructor(
    public backgroundService: BackgroundService,
    private dynamicContentService: DynamicContentService,
    private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngAfterViewInit(): void {
    this.dynamicContentService.getPages();

    this.dynamicContentService.pages$.subscribe((pages) => {
      this.pages = pages;
      this.categories = this.pages.map((page) => page.category);
      this.checkActivatedRoute();
    });
  }

  public toggleBackgroundOverlay(): void {
    const audio = new Audio();
    audio.src = "assets/audio/switch.mp3";
    audio.load();
    audio.play();
    this.backgroundService.toggleBackgroundOverlay();
  }

  private checkActivatedRoute(): void {
    const currentUrl: Params = this.activatedRoute.snapshot.queryParams;
    const pageNumber = currentUrl['page'];

    if (pageNumber?.length && this.pages[+pageNumber]) {
      this.loadUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
        `assets/pages/${pageNumber}.html`
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
    const iframeElement: HTMLIFrameElement = this.pageIframe.nativeElement;

    iframeElement.addEventListener('load', () => {
      const updateIframeHeight = () => {
        iframeElement.style.height =
          iframeElement.contentWindow!.document.body.scrollHeight + 'px';
      };

      updateIframeHeight();

      interval(1000)
        .pipe(take(10))
        .subscribe(() => updateIframeHeight());
    });
  }
}

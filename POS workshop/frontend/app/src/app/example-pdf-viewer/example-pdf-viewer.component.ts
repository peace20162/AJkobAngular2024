import { Component, ChangeDetectionStrategy,ChangeDetectorRef, effect, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IPDFViewerApplication, NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService, PDFNotificationService, PdfSidebarView, RenderedTextLayerHighlights, ScrollModeType } from 'ngx-extended-pdf-viewer';
import { FindState, FindResultMatchesCount } from 'ngx-extended-pdf-viewer';



@Component({
  selector: 'app-example-pdf-viewer',
  templateUrl: './example-pdf-viewer.component.html',
  styleUrls: ['./example-pdf-viewer.component.css'], 
  standalone: true,
  imports: [FormsModule,NgxExtendedPdfViewerModule],
  providers: [NgxExtendedPdfViewerService],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ExamplePdfViewerComponent {
  @ViewChild('searchButton') searchButton?: ElementRef;
  
  // ยังมีปัญหาในเรื่อง สระ ำ  ไม้เอก ไม้โท
  // pdf tool example:
  // https://github.com/stephanrauh/extended-pdf-viewer-showcase/blob/main/src/app/extended-pdf-viewer/find/find.component.html
  public handTool = false;
  public page = 1;
  public pageLabel!: string;
  public rotation: 0 | 90 | 180 | 270 = 0;
  public scrollMode: ScrollModeType = ScrollModeType.vertical;
  public sidebarVisible = true;
  public activeSidebarView: PdfSidebarView = PdfSidebarView.THUMBS;
  public spreadMode: 'off' | 'even' | 'odd' = 'off';
  public src = '/assets/pdfs/Bootstrap-vs-Material-Design-vs-Prime-vs-Tailwind.pdf';
  public zoom: number | string = 'auto';
  public _searchtext = '';

  public highlightAll = false;
  public matchCase = false;
  public wholeWord = false;
  public matchDiacritics = false;

  public multiple = false;

  public matchRegExp = false;




  public currentMatchNumber: number | undefined;

  public totalMatches: number | undefined;

  public findState: FindState | undefined;

  private _fullscreen = false;

  private _selectedTab: number = 0;
  private PDFViewerApplication!: IPDFViewerApplication;
  public dontScrollIntoView: boolean | undefined;


  public pagesWithResult: Array<number> = [];

  public get selectedTab(): number {
    return this._selectedTab;
  }



  public get fullscreen(): boolean {
    return this._fullscreen;
  }

  public set fullscreen(full: boolean) {
    this._fullscreen = full;
  }

  public get findStateText(): string {
    switch (this.findState) {
      case FindState.FOUND:
        return 'found';
      case FindState.NOT_FOUND:
        return 'not found';
      case FindState.PENDING:
        return 'pending';
      case FindState.WRAPPED:
        return 'wrapped';
    }
    return '';
  }

  public get searchtext(): string {
    return this._searchtext;
  }

  public set searchtext(text: string) {
    this._searchtext = text;
    this.find();
  }





  private find(): Array<Promise<number>> | undefined {
    this.pagesWithResult = [];
    if (!this._searchtext) {
      this.findState = undefined;
      this.currentMatchNumber = undefined;
      this.totalMatches = undefined;
    }
    let searchtext = this.multiple ? this._searchtext.split(' ') : this._searchtext;
    const numberOfResultsPromises = this.ngxExtendedPdfViewerService.find(searchtext, {
      highlightAll: this.highlightAll,
      matchCase: this.matchCase,
      wholeWords: this.wholeWord,
      matchDiacritics: this.matchDiacritics,
      dontScrollIntoView: this.dontScrollIntoView,
      useSecondaryFindcontroller: false,
      findMultiple: this.multiple,
      regexp: this.matchRegExp
    });
    numberOfResultsPromises?.forEach(async (numberOfResultsPromise, pageIndex) => {
      const numberOfResultsPerPage = await numberOfResultsPromise;
      if (numberOfResultsPerPage > 0) {
        this.pagesWithResult.push(pageIndex);
      }
    });
    return numberOfResultsPromises;
  }



  constructor(private ngxExtendedPdfViewerService: NgxExtendedPdfViewerService, private cdr: ChangeDetectorRef,
    notificationService: PDFNotificationService
  ) {
    effect(() => {
      this.PDFViewerApplication = notificationService.onPDFJSInitSignal();
      this.PDFViewerApplication?.eventBus?.on('renderedtextlayerhighlights', (event: RenderedTextLayerHighlights) => {
        event.highlights.forEach((highlight) => {
          highlight.style.border = '2px solid black';
        });
      });
    });
  }

  public updateFindState(result: FindState) {
    this.findState = result;
  }

  public updateFindMatchesCount(result: FindResultMatchesCount) {
    this.currentMatchNumber = result.current;
    this.totalMatches = result.total;
    this.cdr.detectChanges();
  }

  public search() {
    let searchtext = this.multiple ? this._searchtext.split(' ') : this._searchtext;
    this.ngxExtendedPdfViewerService.find(searchtext, {
      highlightAll: this.highlightAll,
      matchCase: this.matchCase,
      wholeWords: this.wholeWord,
      matchDiacritics: this.matchDiacritics,
      findMultiple: this.multiple,
      regexp: this.matchRegExp,
      dontScrollIntoView: this.dontScrollIntoView,
      useSecondaryFindcontroller: false
    });
  }



  public findNext(useSecondaryFindcontroller: boolean): void {
    this.ngxExtendedPdfViewerService.findNext(useSecondaryFindcontroller);
  }

  public findPrevious(useSecondaryFindcontroller: boolean): void {
    this.ngxExtendedPdfViewerService.findPrevious(useSecondaryFindcontroller);
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this._searchtext = "ท่าอากาศยาน";
    this.highlightAll = true; 
    //Click After 1 second
    setTimeout(() => {
      this.searchButton?.nativeElement.click();
    }, 1000);
   
  }


  
}

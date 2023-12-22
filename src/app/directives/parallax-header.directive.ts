import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appParallaxHeader]'
})
export class ParallaxHeaderDirective {
  header: any;
  headerHeight: number|undefined;
  moveImage: number|undefined;
  scaleImage: number|undefined;

  constructor(public element:ElementRef, public renderer: Renderer2, private domCtrl: DomController) { 

  }

  ngOnInit() {
    let content = this.element.nativeElement;
    this.header = content.getElementsByClassName('parallax-image')[0];
    this.domCtrl.read(()=>{
      this.headerHeight = this.header.clientHeight;
      console.log('Header height:',this.headerHeight);
    })
  }

  @HostListener('ionScroll',['$event']) onContentScroll($event:any) {
    //console.log('EVENT ',$event);
    const scrollTop = $event.detail.scrollTop;
    //console.log('Scroll ',scrollTop);
    if (scrollTop>0) {
      this.moveImage = scrollTop / 2;
      this.scaleImage = 1;
    } else {
      this.moveImage = 0;
      this.scaleImage = 1;
    }
    this.renderer.setStyle(
      this.header, 
      'webkitTransform', 
      'translate3d(0,' + this.moveImage + 'px,0) scale(' +this.scaleImage + ',' + this.scaleImage + ')'
    )
  }
}

import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[mapNode]'
})
export class MapNodeDirective implements OnInit {


  @Input('mapNode') node;

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit(): void {
  }

  drawLine(parent) {
    const point1 = this.el.nativeElement.getBoundingClientRect();
    const point2 = parent.el.nativeElement.getBoundingClientRect();


    let line = this.renderer.createElement('div');
    this.renderer.addClass(line, 'line');
    this.renderer.appendChild(this.el.nativeElement, line);

    // Find the points based off the elements left and top
    let p1 = {x: point1.x, y: point1.y};
    let p2 = {x: point2.x, y: point2.y};


    // Get distance between the points for length of line
    let a = p1.x - p2.x;
    let b = p1.y - p2.y;
    let length = Math.sqrt(a * a + b * b);

    // Get angle between points
    let angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

    // Get distance from edge of point to center
    let pointWidth = point1.width / 2;
    let pointHeight = point1.width / 2;

    // Set line distance and position
    // Add width/height from above so the line starts in the middle instead of the top-left corner
    this.renderer.setStyle(line, 'width', length + 'px');
    this.renderer.setStyle(line, 'left', (p1.x + pointWidth) + 'px');
    this.renderer.setStyle(line, 'top', (p1.y + 50) + 'px');
    // Rotate line to match angle between points
    this.renderer.setStyle(line, 'transform', "rotate(" + angleDeg + "deg)");


    /*



    // Rotate line to match angle between points
    line.style.transform = "rotate(" + angleDeg + "deg)";

*/
  }
}

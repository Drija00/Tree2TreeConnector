import { NestedTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectorRef } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { R } from '@angular/cdk/keycodes';
import { DialogServiceService } from '../../services/dialog-service.service';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
      },
    ],
  },
];

  interface CheckboxPair {
    left: HTMLElement | null;
    leftName: string | null;
    right: HTMLElement | null;
    rightName: string | null;
    hidden: boolean;
    line: any;
  }

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatTreeModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatToolbarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent  implements AfterViewInit {

  selectedPairs: CheckboxPair[] = [];

  selectedItemLeft: HTMLElement | null = null;
  selectedItemRight: HTMLElement | null = null;
  nodeNameLeft: string = "";
  nodeNameRight: string = "";
  
  @ViewChild('connectorSvg', { static: false }) connectorSvg!: ElementRef<SVGSVGElement>;
  @ViewChild('connectorLine', { static: false }) connectorLine!: ElementRef<SVGLineElement>;

  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  treeControl123 = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  dataSource123 = new MatTreeNestedDataSource<FoodNode>();

  constructor(private cdr: ChangeDetectorRef, private dialogService: DialogServiceService) {
    this.dataSource.data = TREE_DATA;
    this.dataSource123.data = TREE_DATA;
  }

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;


  onToggle(node: FoodNode, isExpanded: boolean, side: 'left' | 'right') {
  
    requestAnimationFrame(() => {
      this.cdr.detectChanges();
  
      if (isExpanded) {
        if (this.isNodeVisible(side)) {
          this.showHiddenLines(side);
        } else {
        }
      } else {
        this.clearLinesIfChild(side, node);
      }
    });
  }
  
  
  isNodeVisible(side: 'left' | 'right'): boolean {
    const selectedNode = side === 'left' ? this.selectedItemRight : this.selectedItemLeft;
    return selectedNode ? true : false;
  }
  
  isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  clearLinesIfChild(side: 'left' | 'right', node: FoodNode) {
    let shouldUpdateLine = false;
  
    if (side === 'left') {
      if (this.selectedItemLeft) {
        this.isChildOfCollapsedParent(node, side)
      } else {
        shouldUpdateLine = true;
      }
    } else {
      if (this.selectedItemRight) {
        this.isChildOfCollapsedParent(node, side)
      } else {
        shouldUpdateLine = true;
      }
    }
  
      this.updateLines();
    
  }

  showHiddenLines(side: 'left' | 'right') {
    this.selectedPairs.forEach(pair =>{
      if((side === 'left' || side==='right') && pair.hidden){
        pair.hidden = false;
      }
    })
    
    this.updateLines();
  }
  

  isChildOfCollapsedParent(parent: FoodNode, side: 'left' | 'right') {
    if (!parent.children) {
      return false; 
    }
  
    for (const child of parent.children) {
      this.selectedPairs.forEach(pair => {
        if (side === 'left' && pair.leftName === child.name) {
          this.hideLines(child.name, 'left');
        }
        if (side === 'right' && pair.rightName === child.name) {
          this.hideLines(child.name, 'right');
        }
      });
  
      if (child.children) {
        this.isChildOfCollapsedParent(child, side);
      }
    }

    return false;
  }
  
  
  onCheckboxClick(event: MouseEvent, side: 'left' | 'right', nodeName:string){
    event.stopPropagation();
    const checkbox = event.target as HTMLInputElement;
    if(checkbox.checked){
      this.selectNode(event,side,nodeName);
    }else{
      this.deselectNode(event,side,nodeName);
    }
    
  }

  selectNode(event: MouseEvent, side: 'left' | 'right', nodeName:string){
    const target = event.currentTarget as HTMLElement;
    if (side === 'left') {
      this.selectedItemLeft = target;
      this.nodeNameLeft = nodeName;
      this.updateLastPair(target, null, nodeName);
      console.log(this.nodeNameLeft)
    } else {
      this.selectedItemRight = target;
      this.nodeNameRight = nodeName;
      this.updateLastPair(null, target, nodeName);
    }

    if (this.selectedItemLeft && this.selectedItemRight) {
      this.updateLines();
    }
  }

  deselectNode(event: MouseEvent, side: 'left' | 'right', nodeName:string){
    const target = event.currentTarget as HTMLElement;
    if(side === 'left'){
      this.selectedItemLeft = null;
      this.nodeNameLeft = "";
      this.updateDiselectedNode(target,'left')
    }else{
      this.selectedItemRight = null;
      this.nodeNameRight ="";
      this.updateDiselectedNode(target,'right')
    }

    this.updateLines();
  }

  updateDiselectedNode(node: HTMLElement | null,side: 'left' | 'right'){
    if (this.selectedPairs.length > 0) {
      for (const c of this.selectedPairs) {
        if(node!=null && c.left==node){
          c.left=null;
          c.leftName = null;
          c.hidden = true;
        }else if(node!=null && c.right==node){
          c.right=null;
          c.rightName = null;
          c.hidden = true;
        }
        this.updateLines();
    }
  }
}

  updateLastPair(left: HTMLElement | null, right: HTMLElement | null, nodeName: string | null) {
    
    let updated = false;
    this.selectedPairs.forEach((pair, index) => {
  
      if ((pair.left === null && left !== null) || (pair.right === null && right !== null)) {
        if (left !== null && pair.left === null) {
          pair.left = left;
          pair.leftName = nodeName;
        }
  
        if (right !== null && pair.right === null) {
          pair.right = right;
          pair.rightName = nodeName;
        }
        pair.hidden = false;
        updated = true;
      }
    });
  
    if (!updated) {
      let hidden: boolean = false;
      let line;
      let leftName = 'left' ? nodeName : null;
      let rightName = 'right' ? nodeName : null;
      this.selectedPairs.push({ left, leftName, right, rightName, hidden, line });
    }
  }
  
   updateLines() {
    const svg = this.connectorSvg.nativeElement;
    svg.innerHTML = '';

    this.selectedPairs.forEach((pair, index) => {
      if (pair.left && pair.right) {
        if(!pair.hidden && this.isElementVisible(pair.left) && this.isElementVisible(pair.right)){
          console.log("LEVO  "+pair.leftName)
          console.log("DESNO  "+pair.rightName)
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          const center1 = this.getCenter(pair.left);
          const center2 = this.getCenter(pair.right);
          line.setAttribute('x1', center1.x.toString());
          line.setAttribute('y1', center1.y.toString());
          line.setAttribute('x2', center2.x.toString());
          line.setAttribute('y2', center2.y.toString());
          line.setAttribute('visibility', 'visible')
          line.setAttribute('stroke', 'orange');
          line.setAttribute('stroke-width', '3');
          line.setAttribute('id', `connectorLine-${index}`);
          pair.line = line;
          svg.appendChild(line);
      }else{
        pair.line.setAttribute('visibility', 'hidden')
      }
    }
    });
  }

  getCenter(el: HTMLElement): { x: number; y: number } {
    const rect = el.getBoundingClientRect();
    
    const toolbar = document.querySelector('.myToolbar') as HTMLElement;
    const toolbarHeight = toolbar ? toolbar.offsetHeight : 0;
    
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2 - toolbarHeight,
    };
  }


  hideLines(nodeName:string, side: 'left' | 'right') {
    const svg = this.connectorSvg.nativeElement;
    const lines = svg.querySelectorAll('line');
    lines.forEach(line => {
      console.log('LINIJA '+ line)
      this.selectedPairs.forEach(pair => {
        if((side === 'left' && line.getAttribute('id') === pair.line.getAttribute('id') && nodeName === pair.leftName) ||
        (side === 'right' && line.getAttribute('id') === pair.line.getAttribute('id') && nodeName === pair.rightName)){
          pair.hidden = true;
        }
      })});
      this.updateLines();
  }

  ngAfterViewInit() {
    this.dialogService.currentPairs.subscribe(() => {
      this.showPairs()
    });
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('resize', this.updateLines.bind(this));
  }
  
  handleScroll() {
    console.log('Scroll event detected');
    this.updateLines();
  }

  showPairs(){
   this.dialogService.setData(this.selectedPairs)
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
    window.removeEventListener('resize', this.updateLines.bind(this));
  }

  
}

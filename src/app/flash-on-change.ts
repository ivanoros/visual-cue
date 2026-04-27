import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  inject
} from '@angular/core';

@Directive({
  selector: '[flashOnChange]',
  standalone: true
})
export class FlashOnChangeDirective implements OnChanges {
  @Input() flashOnChange: unknown;

  private previousValue: unknown;
  private initialized = false;

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['flashOnChange']) {
      return;
    }

    const currentValue = changes['flashOnChange'].currentValue;

    if (!this.initialized) {
      this.previousValue = currentValue;
      this.initialized = true;
      return;
    }

    if (this.previousValue !== currentValue) {
      this.triggerFlash();
    }

    this.previousValue = currentValue;
  }

  private triggerFlash(): void {
    this.renderer.addClass(this.el.nativeElement, 'changed-cell');

    window.setTimeout(() => {
      this.renderer.removeClass(this.el.nativeElement, 'changed-cell');
    }, 1500);
  }
}

//Usage:
// <td [flashOnChange]="customer.price">
//   {{ customer.price }}
// </td>

// CSS:
// .changed-cell {
//   background-color: rgba(255, 230, 150, 0.45);
//   transition: background-color 1.5s ease-out;
// }

//AG Grid approach

//AG Grid has built-in change animation:
// columnDefs = [
//   {
//     field: 'price',
//     cellClassRules: {
//       'value-up': params => params.value > params.oldValue,
//       'value-down': params => params.value < params.oldValue
//     }
//   },
//   {
//     field: 'quantity'
//   },
//   {
//     field: 'status'
//   }
// ];

//And enable row identity:
//getRowId = (params: any) => params.data.id;

//Then update data:
// this.rowData.set(newCustomers);

//For better enterprise UX, use:
// defaultColDef = {
//   sortable: true,
//   filter: true,
//   resizable: true,
//   enableCellChangeFlash: true
// };

//Or per column:
// {
//   field: 'price',
//   enableCellChangeFlash: true
// }
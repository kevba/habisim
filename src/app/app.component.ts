import { Component, inject, OnInit } from '@angular/core';
import { SimStateService } from './services/sim-state.service';
import { BoardComponent } from './board/board.component';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ControlService } from './services/controls.service';

@Component({
  selector: 'app-root',
  imports: [BoardComponent, DividerModule, ButtonModule],
  template: `
    <div class="w-full h-screen grid grid-cols-14 bg-zinc-100">
      <div class="col-span-10 flex place-content-center items-center">
        <app-board></app-board>
      </div>
      <div class="col-span-4 bg-zinc-200 flex flex-col p-4">
        <div class="flex flex-col gap-2">
          <h2 class="text-2xl">Controls</h2>

          <div class="flex justify-between items-center">
            <label>Basic Foxes and Rabbits</label>
            <p-button
              (click)="controls.generateBasic()"
              icon="pi pi-refresh"
            ></p-button>
          </div>

          <div class="flex justify-between align-center">
            <label>Fill Dummies</label>
            <p-button
              (click)="controls.fillDummyEntities()"
              icon="pi pi-refresh"
            ></p-button>
          </div>

          <div>
            <h2 class="text-2xl">Stats</h2>


            <div class="flex items-center gap-2">
              <label> Biosphere </label>
              <div class="h-8 w-full">
                {{ state.biosphere().length }}
              </div>
            </div>
            <div class="h-8 w-full">
              {{ state.surface().length }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AppComponent {
  state = inject(SimStateService);
  controls = inject(ControlService);

  title = 'habisim';

  constructor() {}
  ngOnInit() {
    this.controls.generateBasic();
  }
}

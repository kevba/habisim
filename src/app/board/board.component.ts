import { Component, OnInit, computed, ElementRef, inject, effect, NgZone, ChangeDetectorRef, viewChild } from '@angular/core';
import { SimStateService } from '../services/sim-state.service';

import { Coords, Entity } from '../../entities/models';

@Component({
    selector: 'app-board',
    template: `
        <canvas id="canvas" #canvas [width]="size" [height]="size" style="border:1px solid #000000;"></canvas>
    `,
    styles: []
})
export class BoardComponent {
    readonly size = 800

    simState = inject(SimStateService)
    cdr = inject(ChangeDetectorRef)

    canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas')
    context = computed(() => {
        this.cdr.detectChanges()
        return this.canvas()?.nativeElement.getContext('2d')!
    })

    constructor() {
        effect(() => {
            const t = this.simState.tick()
            
            const state = this.simState.getState()
            this.context().clearRect(0, 0, this.size, this.size)
            this.drawGrid(this.simState.size())

            state.forEach((entities, coordsText) => {
                entities.sort((k1, k2) => k1.zIndex - k2.zIndex)
                entities.forEach((e) => {
                    this.draw(Coords.from(coordsText), e)
                })
            })
        })

        effect(() => {
            this.context().clearRect(0, 0, this.size, this.size)
            this.drawGrid(this.simState.size())
        })
    }
    
    private draw(coords: Coords, entity: Entity): void {

        const context = this.context()
        let scale = this.size / this.simState.size()
        entity.render(coords, scale, context)
    }

    private drawGrid(width: number) {
        const context = this.context()

        context.fillStyle = '#afafaf'
        let scale = this.size / width
        
        for (let x = 0; x < width; x++) {
            let offset = scale * x
            context.fillRect(offset, 0, 1, this.size)
        }
    
        for (let y = 0; y < width; y++) {
            let offset = scale * y
            context.fillRect(0, offset, this.size, 1)
        }
    }
}
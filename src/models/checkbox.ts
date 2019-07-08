import { Control } from "./control";
import { Rgb } from "./rgb";

export class Checkbox extends Control {
    public autofocus: boolean = false;
    public checked: boolean = false;
    public disabled: boolean = false;
    public name: string = "Checkbox";
    public width: number = 50;
    public height: number = 50;

    constructor(zOrder: number){ super(zOrder); }

    draw(ctx: CanvasRenderingContext2D){
        super.draw(ctx);
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);
        this.ctx.textBaseline = "bottom";
        this.ctx.fillText(this.name, this.x + this.width, this.y + this.height);
    }

    public isChecked(): void {
        this.checked = true;

        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + this.width*0.2, this.y + this.height*0.5);
        this.ctx.lineTo(this.x + this.width*0.5, this.y + this.height*0.8);
        this.ctx.lineTo(this.x + this.width*0.8, this.y + this.height*0.2);

        this.ctx.stroke();
    }

    public isNotChecked(){
        this.checked = false;
        this.ctx.fillStyle = (new Rgb(255,255,255)).getColor();
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}
import { Control } from "./control";
import { Panel } from "./panel";
import { InputText } from "./inputText";
import { Rgb } from "./rgb";

export class Input extends Panel {
    public focus: boolean = false;
    public inputText: InputText;
    public font: string = "30px Arial";
    public fillStyle: Rgb = new Rgb(0,0,0);

    public padding: number = 5;

    public backgroundImageFocus: HTMLImageElement | null;
    public backgroundColorFocus: Rgb | null;
    public borderFocus: Rgb | null;
    public borderLineWidthFocus: number;
    public click: () => void = () => this.focusOnMe();

    constructor(x: number, y: number, width: number, height: number, backgroundImage: HTMLImageElement | null,
        backgroundColor: Rgb | null, border: Rgb | null,
        borderLineWidth: number, zOrder: number, parent: Control,
        ctx: CanvasRenderingContext2D, inputText: InputText,
        font: string, fillStyle: Rgb, padding: number,
        backgroundImageFocus: HTMLImageElement | null,
        backgroundColorFocus: Rgb | null, borderFocus: Rgb | null,
        borderLineWidthFocus: number) {

        super(x, y, width, height, backgroundImage, backgroundColor, border, borderLineWidth, zOrder, parent, ctx);
        this.inputText = inputText;
        this.font = font;
        this.fillStyle = fillStyle;


        this.padding = (padding * this.width / 100) / 2;

        this.backgroundImageFocus = backgroundImageFocus;
        this.backgroundColorFocus = backgroundColorFocus;
        this.borderFocus = borderFocus;
        this.borderLineWidthFocus = borderLineWidthFocus;
    }

    public draw() {
        super.draw();
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.fillStyle.getColor();
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(this.inputText.getText(), this.x + this.padding/2, this.y + this.height/2, this.width - this.padding);
    }

    public focusOnMe(): void {
        this.focus = true;
        this.ctx.font = this.font;
        this.ctx.lineWidth = this.borderLineWidth;
        this.ctx.strokeStyle = this.borderFocus.getColor();
        this.ctx.fillStyle = this.backgroundColorFocus.getColor();
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = this.fillStyle.getColor();
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(this.inputText.getText(), this.x + this.padding/2, this.y + this.height/2, this.width - this.padding);
    }

    public unfocus(): void {
        this.focus = false;
        this.ctx.font = this.font;
        this.ctx.lineWidth = this.borderLineWidth;
        this.ctx.strokeStyle = this.border.getColor();
        this.ctx.fillStyle = this.backgroundColor.getColor();
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = this.fillStyle.getColor();
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(this.inputText.getText(), this.x + this.padding/2, this.y + this.height/2, this.width - this.padding);
    }

    public printText(){
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.backgroundColorFocus.getColor();
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);

        this.ctx.fillStyle = this.fillStyle.getColor();
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(this.inputText.getText(), this.x + this.padding/2, this.y + this.height/2, this.width - this.padding);
    }

}
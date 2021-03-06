import { Rgb } from "../models/rgb";

export class Control {
    readonly controlType: string = "Control";
    public controls: Control[] = [];
    private _x: number = 0;
    private _y: number = 0;
    private _width: number = 150;
    private _height: number = 75;
    private _parent: Control | any;
    protected ctx: CanvasRenderingContext2D | any;
    private _backgroundImage: HTMLImageElement | any;
    public backgroundColor: Rgb | null = new Rgb(200,200,200);
    public border: Rgb | null= new Rgb(0,0,0);
    public borderLineWidth: number = 1;
    public zOrder: number = 0;
    public name: string = "no name";

    public pX: number = 0;
    public pY: number = 0;

    //newX и newY - это sourseX/Y для правильного отображения;
    public sourceX: number = 0;
    public sourceY: number = 0;
    public newW: number = this.width;
    public newH: number = this.height;

    public cutImage: ImageData | undefined;
    public canvas1 = document.createElement("canvas");
    public ctx1: CanvasRenderingContext2D | any;

    public click: ((control: Control) => void) | any;
    public mouseup: ((constrol: Control) => void) | any;
    public mousedown: ((control: Control) => void) | any;
    public mousemove: ((control: Control) => void) | any;
    public mouseleave: ((control: Control) => void) | any;
    public mouseover: ((control: Control) => void) | any;

    public draw(ctx: CanvasRenderingContext2D): void {
        this.ctx = ctx;
    }

    public redrawOnBufferHolst(ctx: CanvasRenderingContext2D): void{}

    get x(): number{ return this._x; }
    set x(nX: number) {
        this._x = nX;
        this.sourceX = this.x < 0 ? -this.x : this.x;
        if(this.x < 0){
            this.newW = this.width - this.sourceX;
        }
    }

    get y():number { return this._y; }
    set y(nY: number) {
        this._y = nY;
        this.sourceY = this.y < 0 ? -this.y : this.y;
        if(this.y < 0){
            this.newH = this.height - this.sourceY;
        }
    }

    get width():number { return this._width; }
    set width(newWidth: number) {
        this._width = newWidth;
        this.newW = newWidth;
    }

    get height():number { return this._height }
    set height(newHeight: number) {
        this._height = newHeight;
        this.newH = newHeight;
    }

    get parent(): Control { return this._parent;}
    set parent(newParent: Control) {
        this._parent = newParent;
        this.zOrder = newParent.zOrder + 1;

        let parent = newParent;
        while(parent){
            this.pX += parent.x;
            this.pY += parent.y;
            parent = parent.parent;
        }

        if(this.x < 0){
            this.newW = this.width - this.sourceX;
        }
        if(this.y < 0){
            this.newH = this.height - this.sourceY;
        }

        if(this.x >= 0 && (this.x + this.newW) > this.parent.width){
            this.newW = this.parent.width - this.x;
        }

        if(this.y >= 0 && (this.y + this.newH) > this.parent.height){
            this.newH = this.parent.height - this.y;
        }

        if(this.x < 0 && this.newW > this.parent.width){
            this.newW = this.parent.width;
        }

        if(this.y < 0 && this.newH > this.parent.height){
            this.newH = this.parent.height;
        }
    }

    get backgroundImage(): HTMLImageElement{ return this._backgroundImage; }
    set backgroundImage(newBackIm: HTMLImageElement){
        this._backgroundImage = newBackIm;
    }

    public getControlType(): string{
        return this.controlType;
    }
}
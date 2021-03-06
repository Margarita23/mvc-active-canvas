import { Control } from "../controls/control";
import { Subject } from "rxjs";
import { Input } from "../controls/input";
import { Panel } from "../controls/panel";
import { Button } from "../controls/button";
import { Rgb } from "./rgb";

export abstract class View {
    public controls: Control[] = [];
    public inputFocus: Input | null = new Input();
    public ctx: CanvasRenderingContext2D | any;
    public hoverControl: Control | undefined;
    public bufferForHoverControl: Control | undefined;
    public scrollPanel: Control | any;
    public scrollWidget: Control | undefined;
    public cutImage: ImageData | undefined;
    public ctx1: CanvasRenderingContext2D | any;
    public canvas1 = document.createElement("canvas");

    public shiftAtAll: number = 0;
    public isDown: boolean | null = false;

    constructor() {}

    public registerControl(control: Control): void{
        if(control.parent){
            control.parent.controls.push(control);
        } else {
            this.controls.push(control);
        }
    }

    public setSubject(globalEvent: Subject<any>): void{
        globalEvent.subscribe(event => {
            switch(this.whichEvent(event.type)){
                case 'MouseEvent': this.reactionOnMouseEvent(event); break;
                case 'KeyBoard': this.reactionOnKeyBoardEvent(event); break;
                default : break;
            }
        });
    }

    private reactionOnMouseEvent(event: MouseEvent): void{
        let res = new Array<Control>();
        this.searchNeededControl(res, this.controls, event.x, event.y);

        let trueControl = res[res.length - 1];
        switch(event.type) {
            case 'mousedown' :
                    if(trueControl && trueControl.mousedown){
                        trueControl.mousedown(trueControl);
                    }
                return;
            case 'mouseup' :
                if( trueControl && trueControl.mouseup){
                    setTimeout(this.runAfterUpWithSlowerReaction, 200, trueControl);
                }
                return;
            case 'click' :
                if(trueControl && trueControl.click){
                    setTimeout(this.runAfterClickWithSlowerReaction, 300, this, trueControl);
                }
                if(trueControl && trueControl.parent instanceof Panel
                    && trueControl.parent.widgetVertical === trueControl
                    && trueControl.parent.isScroll){
                        this.scrollWidget = trueControl;
                        this.scrollPanel = trueControl.parent;
                } else {
                    this.scrollWidget = undefined;
                    this.scrollPanel = undefined;
                }
                return;
            case 'mousemove' :
                if(trueControl){
                    if(trueControl.mousemove){
                        if(trueControl !== this.hoverControl) {
                            if(this.hoverControl && this.hoverControl.mouseover){
                                this.hoverControl.mouseover(this.hoverControl);
                            }
                            this.hoverControl = trueControl;
                        }
                        trueControl.mousemove(trueControl);
                    } else {
                        if(this.hoverControl && this.hoverControl.mouseover){
                            this.hoverControl.mouseover(this.hoverControl);
                        }
                        this.hoverControl = undefined;
                    }
                } else {
                    if(this.hoverControl && this.hoverControl.mouseover){
                        this.hoverControl.mouseover(this.hoverControl);
                    }
                    this.hoverControl = undefined;
                }

            if(this.scrollWidget && this.scrollPanel){
                this.canvas1.width = this.scrollPanel.x + this.scrollPanel.width;
                this.canvas1.height = this.scrollPanel.y + (<Panel>this.scrollWidget.parent).newH;
                this.ctx1 = this.canvas1.getContext("2d");

                this.createNewHOLST(this.scrollPanel);
                this.calculateShowYPos(<Button>this.scrollWidget, <Panel>this.scrollPanel);
                this.redrawWidget(<Button>this.scrollWidget, event.y);
            }
            return;
        }
    }

    //---------------------------------
    private createNewHOLST(control: Control): void{
        if(control.backgroundColor){
            this.ctx1.fillStyle = control.backgroundColor.getColor();
            this.ctx1.fillRect(control.x + control.pX, control.y + control.pY, control.width, (<Panel>control).wholeHeight);
        }
        if(control.backgroundImage){
            this.ctx1.drawImage(control.backgroundImage, control.x + control.pX, control.y + control.pY, control.width, (<Panel>control).wholeHeight);
        }
        if(control.border){
            this.ctx1.strokeStyle = control.border.getColor();
            this.ctx1.strokeRect(control.x + control.pX, control.y + control.pY, control.width, (<Panel>control).wholeHeight);
        };

        let f = this.scrollPanel.controls.filter((c: any) => c != this.scrollWidget);
        this.reDraw(f);
    }

    public reDraw(controls: Control[]): void {
        controls.forEach(control => {
            control.draw(this.ctx1);
            if(control.controls.length !== 0){
                this.reDraw(control.controls);
            }
        });
    }

    private searchNeededControl(ret: Control[], controls: Control[], eX: number, eY: number): void {
        controls.forEach(control => {
            if(this.onControl(control, eX, eY)){
                if(control.controls.length === 0){
                    ret.pop();
                }
                ret.push(control);
            }
            if(control.controls.length !== 0){
                this.searchNeededControl(ret, control.controls, eX, eY);
            }
        });
    }

    private runAfterUpWithSlowerReaction(trueControl: Control) {
        trueControl.mouseup(trueControl);
    }

    redrawWidget(widget: Control, y: number): void {
        if(y <= widget.pY){
            widget.y = 0;
        } else if(y >= widget.pY + widget.parent.newH){
            widget.y = widget.parent.newH - widget.newH - widget.borderLineWidth;
        } else if(y >= widget.pY + widget.newH && y <= widget.pY + widget.parent.newH - widget.borderLineWidth){
            widget.y = y - widget.pY - widget.newH;
        }

        this.ctx.fillStyle = (new Rgb(255,255,255)).getColor();
        this.ctx.fillRect(widget.parent.newW - widget.newW + widget.pX, widget.parent.y + widget.parent.pY , widget.newW, widget.parent.newH);
        this.ctx.strokeStyle = (new Rgb(0,0,0)).getColor();
        this.ctx.strokeRect(widget.parent.newW - widget.newW + widget.pX, widget.parent.y + widget.parent.pY , widget.newW, widget.parent.newH);
        this.draw([widget], this.ctx);
    }

    private calculateShowYPos(widget: Button, parent: Panel): void {
        let persentOfRoad = widget.y * 100 / parent.newH;
        let moveOnY = parent.wholeHeight - parent.newH;
        let newPanelY = (moveOnY*persentOfRoad) / 100;

        let littleRoadPercent = (widget.y * 100) / parent.newH;
        let shiftAtAll = ((parent.wholeHeight - parent.newH) * littleRoadPercent) / 100;
        //shiftAtAll - на сколько сдвинуть контент вниз или вверх.
        this.scrollPanel.draw(this.ctx);
        let f = this.scrollPanel.controls.filter((c: any) => c ! = this.scrollWidget);

        if(this.shiftAtAll < shiftAtAll){
            this.isDown = true;
        } else if (this.shiftAtAll > shiftAtAll){
            this.isDown = false;
        } else{
            this.isDown = null;
        }

        if(this.isDown !== null){
            let shift = this.shiftAtAll - shiftAtAll;
            f.map((c: any) => {c.y = c.y + shift;
                if(c.y + c.height > c.parent.newH){
                    c.newH = c.parent.newH - c.y;
                }
            });
            this.shiftAtAll = shiftAtAll;
        }
        parent.draw(this.ctx);
        this.draw(f, this.ctx);
    }

    private runAfterClickWithSlowerReaction(view: View, trueControl: Control): void {
        view.allInputUnFocus(view.controls)
        if (trueControl instanceof Input) {
            trueControl.focusOnMe();
            view.inputFocus = <Input>trueControl;
        } else {
            view.inputFocus = null;
        }
        trueControl.click(trueControl);
    }

    private allInputUnFocus(controls: Control[]): void {
        controls.forEach(control => {
            if(control instanceof Input){
                control.unfocus();
            }
            if(control.controls.length !== 0){
                this.allInputUnFocus(control.controls);
            }
        });
    }

    private reactionOnKeyBoardEvent(event: KeyboardEvent): void {
        if(this.inputFocus !== null && this.checkInputKye(event)){
            this.inputFocus.inputText.addText(event.key);
            this.inputFocus.printText();
        }
    }

    private checkInputKye(e: KeyboardEvent): boolean {
        let res = false;
        if(e.key !== "Tab" && e.key !== "Shift" && e.key !== "CapsLock" &&
            e.key !== "Control" && e.key !== "Alt" && e.key !== "Meta" &&
            e.key !== "Enter" && e.key !== "Escape" && e.key !== "Unidentified" &&
            e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "ArrowUp" &&
            e.key !== "ArrowDown"){
            res =true;
        }
        return res;
    }

    private whichEvent(ev: string): string {
        let res = '';
        if(ev === 'click' || ev === 'mousedown' || ev === 'mouseup' || ev === 'mousemove'){
            res = 'MouseEvent';
        }else if(ev === 'keydown' || ev === 'keyup'){
            res = 'KeyBoard';
        }
        return res;
    }

    private onControl(control: Control, clickX: number, clickY: number): boolean {
        let res = false;
        //-------- checking for over control --------
        if(control.x < 0 && control.y < 0) {
            if(control.pX <= clickX && control.pY <= clickY &&
            (control.pX + control.newW) >= clickX &&
            (control.pY + control.newH) >= clickY) {
                res = true;
            }
            return res;
        } else if (control.x < 0) {
            if(control.pX <= clickX && (control.y + control.pY) <= clickY &&
            (control.pX + control.newW) >= clickX &&
            (control.y + control.pY + control.newH) >= clickY) {
                res = true;
            }
            return res;
        } else if (control.y < 0) {
            if((control.x + control.pX) <= clickX && control.pY <= clickY &&
            (control.x + control.pX + control.newW) >= clickX &&
            (control.pY + control.newH) >= clickY) {
                res = true;
            }
            return res;
        }
        //----------------

        if( (control.x + control.pX) <= clickX && (control.y + control.pY) <= clickY &&
            (control.x + control.pX + control.newW) >= clickX &&
            (control.y + control.pY + control.newH) >= clickY) {
            res = true;
        }
        return res;
    }

    public draw(controls: Control[], ctx: CanvasRenderingContext2D): void {
        this.ctx = ctx;
        controls.forEach(control => {
            control.draw(this.ctx);
            if(control.controls.length !== 0){
                this.draw(control.controls, ctx);
            }
        });
    }
}
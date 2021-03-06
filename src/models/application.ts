import { View } from "./view";
import { Context } from "./context";
import { Subject } from "rxjs";

export class Application {
    public static instance = new Application();
    public ctx: Context = new Context();
    public subject: Subject<Event> = new Subject<Event>();

    private constructor() {
        this.createSub(this.subject);
    }

    private createSub(subject: Subject<Event>){
        document.addEventListener("mousedown", (evt)=>{
            subject.next(evt);
        });
        document.addEventListener("mouseup", (evt)=>{
            subject.next(evt);
        });
        document.addEventListener("click", (evt)=>{
            subject.next(evt);
        });
        document.addEventListener("mousemove", (evt)=>{
            subject.next(evt);
        });
        document.addEventListener("keydown", (evt)=>{
            subject.next(evt);
        });
    }

    public unsubsrc(oldView: View){
        oldView.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
        this.subject.observers.shift();
    }

    public run(view: View){
        view.setSubject(this.subject);
        view.draw(view.controls, this.ctx.ctx);
    }
}
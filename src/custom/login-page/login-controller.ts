import { Input } from "../../controls/input";
import { Checkbox } from "../../controls/checkbox";
import { RadioButton } from "../../controls/radioButton";
import { LoginView } from "./login-view";
import { Application } from "../../models/application";
import { Button } from "../../controls/button";
import { Control } from "../../controls/control";
import { Rgb } from "../../models/rgb";
import { WrapperController } from "../layout/wrapper-controller";
import { WrapperView } from "../layout/wrapper-view";

export class LoginController{

    public view: LoginView;
    public layoutView: WrapperView;
    public layoutController: WrapperController;
    public login: string = "";
    public password: string = "";
    public gender: string = "no gender";
    public gamer: GamerProfile;
    public hoverControl: Control;

    constructor(view: LoginView){
        this.view = view;

        let checkboxShowPass = this.view.loginForm.controls.find(c => c.name === "show");
        checkboxShowPass.click = this.checkedToShowPassword.bind(checkboxShowPass, this);
        let login: Input = <Input>this.view.login;
        login.click = login.focusOnMe;

        let pass: Input = <Input>this.view.pass;
        pass.click = pass.focusOnMe;

        this.view.genderPanel.controls.forEach(radio => {
            if(!(<RadioButton>radio).disabled){
                radio.click = this.checkedMaleOrFemale.bind(radio, this);
            }
        });

        let submit = (<LoginView>this.view).loginForm.controls.find(c => c.name === "submit");

        submit.click = this.submitRegister.bind(submit, this);
        submit.mousemove = this.view.whenSubmitHover.bind(this.view, submit);
        submit.mouseover = this.view.whenSubmitNotHover.bind(this.view, submit);

        let submitColor = submit.backgroundColor;
        submit.mousedown = (submit) => {(<Control>submit).backgroundColor = new Rgb(230,230,230); (<Control>submit).draw(this.view.ctx) };
        
        
        
        let over = (<LoginView>this.view).loginForm.controls.find(c => c.name === "over");
        over.click = ()=> {console.log("I`m HERE!")};
    }

    public submitRegister(controller: LoginController): void{
        if (this instanceof Button){
            let inputControls = this.parent.controls.filter(control => control instanceof Input);
            controller.login = (<Input>inputControls.find(c => c.name === "login")).inputText.text;
            controller.password = (<Input>inputControls.find(c => c.name === "password")).inputText.text;
            let loginForm: GamerProfile = {
                login: controller.login,
                password: controller.password,
                gender: controller.gender
            };
            controller.gamer = loginForm;

            controller.layoutView = new WrapperView();
            controller.layoutController = new WrapperController(controller.layoutView, controller.view, loginForm);
            (Application.getInstance()).run(controller.layoutView);

            controller.layoutController.goToMainPage(controller.layoutView, controller.view);
        }
    }

    public checkedToShowPassword(controller: LoginController): void {
        let box: Checkbox = <any>this;
        if (this instanceof Checkbox){
            if(box.checked) {
                this.checked = false;
                (<Input>(<LoginView>controller.view).loginForm.controls.find(c => c.name === "password" && c instanceof Input)).inputText.secret = true;
            } else {
                this.checked = true;
                (<Input>(<LoginView>controller.view).loginForm.controls.find(c => c.name === "password" && c instanceof Input)).inputText.secret = false;
            }
        }
        (<Input>(<LoginView>controller.view).loginForm.controls.find(c => c.name === "password" && c instanceof Input)).printText();
    }

    public checkedMaleOrFemale(controller: LoginController): void{
        if(this instanceof RadioButton){
            this.setChecked(this, <RadioButton[]>controller.view.genderPanel.controls);
        }
    }
}
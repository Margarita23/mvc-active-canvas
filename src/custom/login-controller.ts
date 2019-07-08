import { Controller } from "../controllers/controller";
import { View } from "../models/view";
import { Input } from "../models/input";
import { Checkbox } from "../models/checkbox";

export class LoginController extends Controller{
    public submitLoginAndPassword(this: View){
        let inputControls = this.controls.filter((control)=>(<Object>control).constructor.name === "Input");
        console.log("login: " + (<Input>inputControls[0]).inputText.getText() + "; password: " + (<Input>inputControls[1]).inputText.text);
    }

    public checkedToShowPassword(this: Checkbox, passwordInput: Input): void {
        if(this.checked) {
            this.isNotChecked();
            passwordInput.setPrivateInput(false);
        }else {
            this.isChecked();
            passwordInput.setPrivateInput(true);
        }
    }
}
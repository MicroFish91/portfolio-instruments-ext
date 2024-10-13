import { window } from "vscode";
import { RegisterContext } from "./RegisterContext";

export function register(_: RegisterContext) {
    window.showInformationMessage("called register");

}
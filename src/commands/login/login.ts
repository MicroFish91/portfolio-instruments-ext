import { window } from "vscode";
import { LoginContext } from "./LoginContext";

export function login(_: LoginContext) {
    window.showInformationMessage("called login");
}
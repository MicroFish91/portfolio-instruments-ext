import { window } from "vscode";
import { LoginItem } from "../../tree/auth/LoginItem";
import { LoginContext } from "./LoginContext";

export function login(_: LoginContext, __: LoginItem) {
    window.showInformationMessage("called login");
}
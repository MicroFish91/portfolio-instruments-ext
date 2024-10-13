import { window } from "vscode";
import { RegisterItem } from "../../tree/auth/RegisterItem";
import { RegisterContext } from "./RegisterContext";

export function register(_: RegisterContext, __: RegisterItem) {
    window.showInformationMessage("called register");
}
import { ExtensionContext } from "vscode";
import { PiExtTreeDataProvider } from "./tree/PiExtTreeDataProvider";

export namespace ext {
    export let context: ExtensionContext;
    export let portfolioInstrumentsTdp: PiExtTreeDataProvider;
}
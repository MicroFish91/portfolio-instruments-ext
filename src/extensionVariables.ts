import { ExtensionContext } from "vscode";
import { PiExtTreeDataProvider } from "./tree/PiExtTreeDataProvider";
import { ReadOnlyContentProvider } from "./commands/viewProperties/ReadOnlyContentProvider";
import { SnapshotDraftFileSystem } from "./commands/draft/SnapshotDraftFileSystem";

export namespace ext {
    export let context: ExtensionContext;
    export let portfolioInstrumentsTdp: PiExtTreeDataProvider;
    export let readOnlyProvider: ReadOnlyContentProvider;
    export let snapshotDraftFileSystem: SnapshotDraftFileSystem;
}
import { l10n, Uri } from "vscode";
import { PiExtTreeItem } from "../../tree/PiExtTreeDataProvider";
import { CommandContext } from "../registerCommand";
import { ReadOnlyContentProvider } from "./ReadOnlyContentProvider";
import { nonNullValue } from "../../utils/nonNull";
import { ext } from "../../extensionVariables";

export async function viewProperties(_: CommandContext, item?: PiExtTreeItem): Promise<void> {
    if (!item?.viewProperties) {
        throw new Error(l10n.t("internal error: item does not have a view properties defined"));
    }

    const props: string = await item.viewProperties();
    const uri: Uri = ReadOnlyContentProvider.getUri(nonNullValue(item?.id));

    ext.readOnlyProvider.addContent(uri, props);
    ext.readOnlyProvider.displayContent(uri);
}
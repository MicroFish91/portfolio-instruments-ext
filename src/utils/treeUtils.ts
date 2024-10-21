import { Uri } from "vscode";
import { ext } from "../extensionVariables";

export namespace treeUtils {
    export function getIconPath(relativeResourcesPath: string): Uri {
        return Uri.joinPath(getResourcesUri(), relativeResourcesPath);
    }

    function getResourcesUri(): Uri {
        return Uri.joinPath(ext.context.extensionUri, 'resources');
    }
}
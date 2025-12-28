import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../../../PiExtTreeDataProvider";
import { ext } from "../../../../../extensionVariables";
import { SnapshotByMaturationDateItem } from "./SnapshotByMaturationDateItem";
import { Snapshot } from "../../../../../sdk/portfolio-instruments-api";

export class SnapshotMaturationEndItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotMaturationEndItem';
    static readonly regExp: RegExp = new RegExp(SnapshotMaturationEndItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotByMaturationDateItem,
        readonly email: string,
        readonly snapshotData: Snapshot,
        date: string,
    ) {
        super(date);
        this.id = `/snapshots/${snapshotData.snap_id}/dashboard/maturationEnd`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            description: l10n.t('End date'),
            contextValue: SnapshotMaturationEndItem.contextValue,
            collapsibleState: TreeItemCollapsibleState.None,
            iconPath: new ThemeIcon("settings", "white"),
        };
    }

    static generatePiExtMaturationEndId(email: string, snapId: number): string {
        return `/users/${email}/snapshots/${snapId}/maturationEnd`;
    }

    static getMaturationEnd(email: string, snapId: number): string | undefined {
        return ext.context.globalState.get(SnapshotMaturationEndItem.generatePiExtMaturationEndId(email, snapId));
    }

    static setMaturationEnd(email: string, snapId: number, maturationEnd: string | undefined): void {
        ext.context.globalState.update(SnapshotMaturationEndItem.generatePiExtMaturationEndId(email, snapId), maturationEnd);
    }
}
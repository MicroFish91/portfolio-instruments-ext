import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../../../PiExtTreeDataProvider";
import { ext } from "../../../../../extensionVariables";
import { SnapshotByMaturationDateItem } from "./SnapshotByMaturationDateItem";
import { Snapshot } from "../../../../../sdk/portfolio-instruments-api";

export class SnapshotMaturationStartItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotMaturationStartItem';
    static readonly regExp: RegExp = new RegExp(SnapshotMaturationStartItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotByMaturationDateItem,
        readonly email: string,
        readonly snapshotData: Snapshot,
        date: string,
    ) {
        super(date);
        this.id = `/snapshots/${snapshotData.snap_id}/dashboard/maturationStart`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            description: l10n.t('Start date'),
            contextValue: SnapshotMaturationStartItem.contextValue,
            collapsibleState: TreeItemCollapsibleState.None,
            iconPath: new ThemeIcon("settings", "white"),
        };
    }

    static generatePiExtMaturationStartId(email: string, snapId: number): string {
        return `/users/${email}/snapshots/${snapId}/maturationStart`;
    }

    static getMaturationStart(email: string, snapId: number): string | undefined {
        return ext.context.globalState.get(SnapshotMaturationStartItem.generatePiExtMaturationStartId(email, snapId));
    }

    static setMaturationStart(email: string, snapId: number, maturationStart: string | undefined): void {
        ext.context.globalState.update(SnapshotMaturationStartItem.generatePiExtMaturationStartId(email, snapId), maturationStart);
    }
}
import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { SnapshotItem } from "./SnapshotItem";
import { createContextValue } from "../../../utils/contextUtils";

const updateableTrue: string = 'updateable:true';
const updateableFalse: string = 'updateable:false';

export class SnapshotDataKeyItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotDataKeyItem';
    static readonly regExp: RegExp = new RegExp(SnapshotDataKeyItem.contextValue);

    id: string;
    private contextValuesToAdd: string[];

    constructor(
        readonly parent: SnapshotItem,
        readonly email: string,

        readonly key: string,
        readonly value: string,
        readonly updateable: boolean = true,
    ) {
        super(value);
        this.id = `/snapshots/${parent.snapshot.snap_id}/snapshotData/${key}`;
        this.description = key;

        this.contextValuesToAdd = [
            SnapshotDataKeyItem.contextValue,
            updateable ? updateableTrue : updateableFalse,
        ];
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            description: this.description,
            contextValue: this.getContextValues(),
            collapsibleState: TreeItemCollapsibleState.None,
            iconPath: new ThemeIcon("dash", "white"),
        };
    }

    private getContextValues(): string {
        return createContextValue(this.contextValuesToAdd);
    }
}
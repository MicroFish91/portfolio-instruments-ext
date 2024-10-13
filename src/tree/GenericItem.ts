import { Command, ThemeIcon, TreeItem, TreeItemCollapsibleState, Uri } from "vscode";

export type GenericItemOptions = {
    id: string;
    label: string;
    command?: Command;
    description?: string;
    contextValue: string;
    iconPath?: string | Uri | {
        light: string | Uri;
        dark: string | Uri;
    } | ThemeIcon;
    collapsibleState?: TreeItemCollapsibleState;
};

export class GenericItem extends TreeItem {
    constructor(options: GenericItemOptions) {
        super(options.label);

        this.id = options.id;
        this.command = options.command;
        this.iconPath = options.iconPath;
        this.description = options.description;
        this.contextValue = options.contextValue;
        this.collapsibleState = options.collapsibleState;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            command: this.command,
            iconPath: this.iconPath,
            description: this.description,
            contextValue: this.contextValue,
            collapsibleState: this.collapsibleState,
        };
    }
}
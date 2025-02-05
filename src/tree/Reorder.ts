import { reorderableContext, reordererContext } from "../constants";
import { PiExtTreeItem } from "./PiExtTreeDataProvider";

/**
 * Refers to a child item that is able to be reordered
 */
export interface Reorderable extends PiExtTreeItem {
    parent: Reorderer;
    kind: string;
    getResourceId(): string;
}

/**
 * Refers to a parent item that is able to reorder its children
 * Important note: Resource IDs refer to the the underlying PI resource IDs, not the tree item IDs
 */
export interface Reorderer extends PiExtTreeItem {
    kind: string;
    canReorderItem(item: PiExtTreeItem): boolean;
    getOrderedResourceModels(resourceModels?: object[]): Promise<GenericPiResourceModel[]>;
    reorderChildrenByTargetResourceModelIds(ids: string[]): void;
}

export function isReorderer(item: PiExtTreeItem): item is (PiExtTreeItem & Reorderer) {
    return !!item.contextValue?.includes(reordererContext);
}

export function isReorderable(item: PiExtTreeItem): item is (PiExtTreeItem & Reorderable) {
    return !!item.contextValue?.includes(reorderableContext);
}

/**
 * The simplest way to represent a generic PI resource without caring what the full resource looks like
 */
export type GenericPiResourceModel = {
    id: string;
};

export function convertToGenericPiResourceModel<T extends {}>(resource: T, idProp: keyof T): T & GenericPiResourceModel {
    return {
        ...resource,
        id: String(resource[idProp]),
    };
}

export function orderResourcesByTargetIds<T extends GenericPiResourceModel>(currentResources: T[], orderedTargetIds: string[]): T[] {
    const resourceMap: Map<string, T> = new Map();
    for (const resource of currentResources) {
        resourceMap.set(resource.id, resource);
    }

    const orderedResources: T[] = [];

    // Order what we can according to targetIds
    for (const targetId of orderedTargetIds) {
        const resource: T | undefined = resourceMap.get(targetId);
        if (!resource) {
            continue;
        }

        orderedResources.push(resource);
        resourceMap.delete(targetId);
    }

    // For whatever is remaining, just add those resources to the end
    for (const resource of resourceMap.values()) {
        orderedResources.push(resource);
    }

    return orderedResources;
}
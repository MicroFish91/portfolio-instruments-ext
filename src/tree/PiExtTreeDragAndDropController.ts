import { CancellationToken, DataTransfer, DataTransferItem, TreeDragAndDropController, } from "vscode";
import { PiExtTreeItem } from "./PiExtTreeDataProvider";
import { GenericPiResourceModel, isReorderable, isReorderer, Reorderable, Reorderer } from "./reorder";

type DataTransferType = {
    reorderer: Reorderer;
    reorderables: readonly Reorderable[];
};

const defaultTreeViewMimeType: string = 'application/vnd.code.tree.portfolioInstruments.main';

export class PiExtTreeDragAndDropController implements TreeDragAndDropController<PiExtTreeItem> {
    readonly dropMimeTypes = [defaultTreeViewMimeType];
    readonly dragMimeTypes = [defaultTreeViewMimeType];

    handleDrag(draggedItems: readonly PiExtTreeItem[], dataTransfer: DataTransfer, _token: CancellationToken): Thenable<void> | void {
        // All dragged items should be classified as 'reorderable'
        if (!draggedItems.every(i => isReorderable(i))) {
            return;
        }

        // Parent should classify as a 'reorderer'
        const parent: Reorderer = draggedItems[0].parent;
        if (!isReorderer(parent)) {
            return;
        }

        const kind = draggedItems[0].kind;
        if (!draggedItems.every(i =>
            i.kind === kind && // Don't try to handle different child kinds during the same drag/drop motion
            i.parent.kind === parent.kind && // Not a super important check, but can't hurt to double check that the parents are all the same
            parent.canReorderItem(i) // The common parent should be configured to understand how to reorder the child elements
        )) {
            return;
        }

        dataTransfer.set(defaultTreeViewMimeType, new DataTransferItem({
            reorderer: parent,
            reorderables: draggedItems,
        } satisfies DataTransferType));
    }

    async handleDrop(target: PiExtTreeItem | undefined, dataTransfer: DataTransfer, _token: CancellationToken): Promise<void> {
        const dt: DataTransferType | undefined = dataTransfer.get(defaultTreeViewMimeType)?.value;
        if (!dt || !target) {
            return;
        }
        if (!isReorderable(target)) {
            return;
        }

        const { reorderer, reorderables } = dt;
        const orderedResources: GenericPiResourceModel[] = await reorderer.getOrderedResourceModels();

        // Use a map to preserve the order and extract the resources; easier/more efficient than finding the index and splicing
        const orderedResourceMap: Map<string, GenericPiResourceModel> = new Map();
        for (const resource of orderedResources) {
            orderedResourceMap.set(resource.id, resource);
        }

        const extractedResources: GenericPiResourceModel[] = [];
        for (const reorderable of reorderables) {
            const resourceId: string = reorderable.getResourceId();
            const resource: GenericPiResourceModel | undefined = orderedResourceMap.get(resourceId);

            if (!resource) {
                continue;
            }
            extractedResources.push(resource);
            orderedResourceMap.delete(resourceId);
        }

        const remainingOrderedResources: GenericPiResourceModel[] = Array.from(orderedResourceMap.values());

        const targetIdx: number = remainingOrderedResources.findIndex(r => r.id === target.getResourceId());
        if (targetIdx === -1) {
            return;
        }

        // Rebuild array of resources, placing extracted resources at the target idx
        const newOrderedResources: GenericPiResourceModel[] = [];
        if (targetIdx !== 0) {
            newOrderedResources.push(...remainingOrderedResources.slice(0, targetIdx));
        }

        newOrderedResources.push(...extractedResources);
        newOrderedResources.push(...remainingOrderedResources.slice(targetIdx));

        const newOrderedResourceIds: string[] = newOrderedResources.map(r => r.id);
        reorderer.reorderChildrenByTargetResourceModelIds(newOrderedResourceIds);
    }
}

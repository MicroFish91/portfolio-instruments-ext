import { CreateSnapshotValuePayload } from "../../../../sdk/snapshots/createSnapshot";
import { SnapshotValueCreateContext } from "../../../snapshotValues/createSnapshotValue/SnapshotValueCreateContext";

export type SnapshotValueDraftUpdateContext = Omit<SnapshotValueCreateContext, 'snapshotId' | 'snapshotValue'> & {
    svIdx: number;
    snapshotValueDraft: CreateSnapshotValuePayload;

    updatedSnapshotValueDraft?: CreateSnapshotValuePayload;
};
import { CreateSnapshotValuePayload } from "../../../../sdk/portfolio-instruments-api";
import { SnapshotValueCreateContext } from "../../../snapshotValues/createSnapshotValue/SnapshotValueCreateContext";

export type SnapshotValueDraftUpdateContext = Omit<SnapshotValueCreateContext, 'snapshotId' | 'snapshotValue'> & {
    svIdx: number;
    snapshotValueDraft: CreateSnapshotValuePayload;

    updatedSnapshotValueDraft?: CreateSnapshotValuePayload;
};
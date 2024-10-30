import { SnapshotValueCreateContext } from "../../../snapshotValues/createSnapshotValue/SnapshotValueCreateContext";

export type SnapshotValueDraftCreateContext = Omit<SnapshotValueCreateContext, 'snapshotId' | 'snapshotValue'>;
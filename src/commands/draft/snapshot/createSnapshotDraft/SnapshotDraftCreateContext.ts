import { SnapshotCreateContext } from "../../../snapshots/SnapshotCreateContext";

export type SnapshotDraftCreateContext = Omit<SnapshotCreateContext, 'snapshot'> & {
    email: string;
};

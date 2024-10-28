import { Snapshot } from "../../../sdk/types/snapshots";
import { SnapshotCreateContext } from "../SnapshotCreateContext";

export type SnapshotUpdateContext = SnapshotCreateContext & {
    snapshot: Snapshot; // Make the current snapshot required
    updatedSnapshot?: Snapshot;
}
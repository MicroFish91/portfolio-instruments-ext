import { Snapshot } from "../../../sdk/portfolio-instruments-api";
import { SnapshotCreateContext } from "../SnapshotCreateContext";

export type SnapshotUpdateContext = SnapshotCreateContext & {
    snapshot: Snapshot; // Make the current snapshot required
    updatedSnapshot?: Snapshot;
}
import { SnapshotValue } from "../../../sdk/types/snapshots";
import { SnapshotValueCreateContext } from "../createSnapshotValue/SnapshotValueCreateContext";

export type SnapshotValueUpdateContext = SnapshotValueCreateContext & {
    snapshotValue: SnapshotValue; // Make existing snapshotValue required
    updatedSnapshotValue?: SnapshotValue;
}
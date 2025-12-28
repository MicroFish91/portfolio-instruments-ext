import { SnapshotValue } from "../../../sdk/portfolio-instruments-api";
import { SnapshotValueCreateContext } from "../createSnapshotValue/SnapshotValueCreateContext";

export type SnapshotValueUpdateContext = SnapshotValueCreateContext & {
    snapshotValue: SnapshotValue; // Make existing snapshotValue required
    updatedSnapshotValue?: SnapshotValue;
}
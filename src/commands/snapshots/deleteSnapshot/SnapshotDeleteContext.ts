import { Snapshot } from "../../../sdk/types/snapshots";
import { AuthContext } from "../../AuthContext";

export type SnapshotDeleteContext = AuthContext & {
    snapshot: Snapshot;
};
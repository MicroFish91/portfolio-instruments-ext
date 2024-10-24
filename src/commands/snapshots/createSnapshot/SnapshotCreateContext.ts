import { Snapshot } from "../../../sdk/types/snapshots";
import { AuthContext } from "../../AuthContext";

export type SnapshotCreateContext = AuthContext & {
    snapshot?: Snapshot;
};
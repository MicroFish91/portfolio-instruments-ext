import { Snapshot } from "../../../sdk/types/snapshots";
import { AuthContext } from "../../AuthContext";

export type SnapshotDraftCreateContext = AuthContext & {
    snapshot?: Snapshot;
};
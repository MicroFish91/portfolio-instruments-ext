import { Snapshot } from "../../sdk/types/snapshots";
import { AuthContext } from "../AuthContext";

export type SnapshotCreateContext = AuthContext & {
    snapDate?: string;
    snapDescription?: string;
    benchmarkId?: number;

    snapshot?: Snapshot;
};
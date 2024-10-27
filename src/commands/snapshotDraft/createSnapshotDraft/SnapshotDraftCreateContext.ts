import { Settings } from "../../../sdk/types/settings";
import { Snapshot } from "../../../sdk/types/snapshots";
import { AuthContext } from "../../AuthContext";

export type SnapshotDraftCreateContext = Omit<SnapshotCreateContext, 'snapshot'> & {
    email: string;
    settings: Settings;
};

export type SnapshotCreateContext = AuthContext & {
    snapDate?: string;
    snapDescription?: string;
    benchmarkId?: number;

    snapshot?: Snapshot;
};
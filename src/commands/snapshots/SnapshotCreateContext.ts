import { Snapshot } from "../../sdk/portfolio-instruments-api";
import { AuthContext } from "../AuthContext";

export type SnapshotCreateContext = AuthContext & {
    snapDate?: string;
    snapDescription?: string;
    benchmarkId?: number;
    rebalanceThresholdPct?: number;

    mostRecentSnapshot?: Snapshot; // Auto-populated after a snapshot date is provided
    snapshot?: Snapshot;
};
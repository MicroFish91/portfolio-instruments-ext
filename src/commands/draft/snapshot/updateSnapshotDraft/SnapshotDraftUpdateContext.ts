import { CreateSnapshotPayload } from "../../../../sdk/portfolio-instruments-api";
import { AuthContext } from "../../../AuthContext";

export type SnapshotDraftUpdateContext = AuthContext & {
    snapDate?: string;
    snapDescription?: string;
    benchmarkId?: number;
    rebalanceThresholdPct?: number;

    snapshotData: Omit<CreateSnapshotPayload, 'snapshot_values'>,
};
import { CreateSnapshotPayload } from "../../../../sdk/snapshots/createSnapshot";
import { AuthContext } from "../../../AuthContext";

export type SnapshotDraftUpdateContext = AuthContext & {
    snapDate?: string;
    snapDescription?: string;
    benchmarkId?: number;

    snapshotData: Omit<CreateSnapshotPayload, 'snapshot_values'>,
};
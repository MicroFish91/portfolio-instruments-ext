import { CreateSnapshotPayload, Snapshot, SnapshotValue } from "../../../../sdk/portfolio-instruments-api";
import { AuthContext } from "../../../AuthContext";

export type SnapshotDraftDeployContext = AuthContext & {
    snapshotPayload: CreateSnapshotPayload;

    snapshot?: Snapshot;
    snapshotValues?: SnapshotValue[];
};
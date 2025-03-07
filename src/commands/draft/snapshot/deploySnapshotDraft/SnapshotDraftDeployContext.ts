import { CreateSnapshotPayload } from "../../../../sdk/snapshots/createSnapshot";
import { Snapshot, SnapshotValue } from "../../../../sdk/types/snapshots";
import { AuthContext } from "../../../AuthContext";

export type SnapshotDraftDeployContext = AuthContext & {
    snapshotPayload: CreateSnapshotPayload;

    snapshot?: Snapshot;
    snapshotValues?: SnapshotValue[];
};
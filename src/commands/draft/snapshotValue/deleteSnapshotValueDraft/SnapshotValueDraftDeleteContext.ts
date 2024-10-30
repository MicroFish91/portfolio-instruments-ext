import { CreateSnapshotValuePayload } from "../../../../sdk/snapshotValue/createSnapshotValue";
import { AuthContext } from "../../../AuthContext";

export type SnapshotValueDraftDeleteContext = AuthContext & {
    svIdx: number;
    snapshotValueDraft: CreateSnapshotValuePayload;
};
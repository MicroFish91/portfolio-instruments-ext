import { CreateSnapshotValuePayload } from "../../../../sdk/portfolio-instruments-api";
import { AuthContext } from "../../../AuthContext";

export type SnapshotValueDraftDeleteContext = AuthContext & {
    svIdx: number;
    snapshotValueDraft: CreateSnapshotValuePayload;
};
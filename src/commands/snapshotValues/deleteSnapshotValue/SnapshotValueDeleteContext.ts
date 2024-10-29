import { SnapshotValue } from "../../../sdk/types/snapshots";
import { AuthContext } from "../../AuthContext";

export type SnapshotValueDeleteContext = AuthContext & {
    snapshotId: number;
    snapshotValue: SnapshotValue;
};
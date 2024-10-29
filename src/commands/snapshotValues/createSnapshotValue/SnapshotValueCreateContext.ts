import { SnapshotValue } from "../../../sdk/types/snapshots";
import { AuthContext } from "../../AuthContext";

export type SnapshotValueCreateContext = AuthContext & {
    snapshotId: number;

    accountId?: number;
    holdingId?: number;
    total?: number;
    skipRebalance?: boolean;

    snapshotValue?: SnapshotValue;
}
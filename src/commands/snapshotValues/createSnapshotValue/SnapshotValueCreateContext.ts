import { SnapshotValue } from "../../../sdk/portfolio-instruments-api";
import { AuthContext } from "../../AuthContext";

export type SnapshotValueCreateContext = AuthContext & {
    snapshotId: number;

    accountId?: number;
    holdingId?: number;
    total?: number;
    skipRebalance?: boolean;

    snapshotValue?: SnapshotValue;
}
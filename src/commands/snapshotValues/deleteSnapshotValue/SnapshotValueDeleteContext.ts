import { SnapshotValue } from "../../../sdk/portfolio-instruments-api";
import { AuthContext } from "../../AuthContext";

export type SnapshotValueDeleteContext = AuthContext & {
    snapshotId: number;
    snapshotValue: SnapshotValue;
};
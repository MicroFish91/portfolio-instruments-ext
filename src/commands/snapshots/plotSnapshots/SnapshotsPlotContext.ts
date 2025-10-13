import { Snapshot } from "../../../sdk/types/snapshots";
import { AuthContext } from "../../AuthContext";

export type SnapshotsPlotContext = AuthContext & {
    startDate?: string;
    endDate?: string;

    snapshots?: Snapshot[];
};
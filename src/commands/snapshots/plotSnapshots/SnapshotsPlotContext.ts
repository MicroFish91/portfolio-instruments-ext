import { Snapshot } from "../../../sdk/portfolio-instruments-api";
import { AuthContext } from "../../AuthContext";

export type SnapshotsPlotContext = AuthContext & {
    startDate?: string;
    endDate?: string;

    snapshots?: Snapshot[];
};
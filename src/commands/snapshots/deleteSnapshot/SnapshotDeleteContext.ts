import { Snapshot } from "../../../sdk/portfolio-instruments-api";
import { AuthContext } from "../../AuthContext";

export type SnapshotDeleteContext = AuthContext & {
    snapshot: Snapshot;
};
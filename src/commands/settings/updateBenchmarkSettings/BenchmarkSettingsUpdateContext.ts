import { Settings } from "../../../sdk/types/settings";
import { AuthContext } from "../../AuthContext";
import { SnapshotCreateContext } from "../../snapshots/SnapshotCreateContext";

export type BenchmarkSettingsUpdateContext = AuthContext & Pick<SnapshotCreateContext, 'benchmarkId'> & {
    settings: Settings;

    updatedSettings?: Settings;
};
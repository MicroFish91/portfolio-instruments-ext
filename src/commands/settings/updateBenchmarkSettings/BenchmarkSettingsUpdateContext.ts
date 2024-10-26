import { Settings } from "../../../sdk/types/settings";
import { AuthContext } from "../../AuthContext";

export type BenchmarkSettingsUpdateContext = AuthContext & {
    benchmarkId?: number;
    settings: Settings;

    updatedSettings?: Settings;
};
import { Settings } from "../../../sdk/types/settings";
import { AuthContext } from "../../AuthContext";

export type RebalanceSettingsUpdateContext = AuthContext & {
    settings: Settings;
    rebalanceThreshold?: number;

    updatedSettings?: Settings;
};
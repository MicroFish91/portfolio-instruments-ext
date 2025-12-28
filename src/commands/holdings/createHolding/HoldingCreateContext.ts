import { AssetCategory, Holding } from "../../../sdk/portfolio-instruments-api";
import { AuthContext } from "../../AuthContext";
import { HoldingType } from "./HoldingTypeListStep";

export type HoldingCreateContext = AuthContext & {
    holdingName?: string;
    holdingType?: HoldingType;
    holdingTicker?: string;
    holdingAssetCategory?: AssetCategory;
    holdingExpenseRatioPct?: number;
    holdingMaturationDate?: string;
    holdingInterestRatePct?: number;

    holding?: Holding;
};

import { AuthContext } from "../../../AuthContext";
import { Holding } from "../../../sdk/types/holdings";

export type HoldingDeleteContext = AuthContext & {
    holding: Holding;
};
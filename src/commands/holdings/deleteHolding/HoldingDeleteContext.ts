import { Holding } from "../../../sdk/portfolio-instruments-api";
import { AuthContext } from "../../AuthContext";

export type HoldingDeleteContext = AuthContext & {
    holding: Holding;
};
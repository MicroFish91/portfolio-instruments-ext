import { Holding } from "../../../sdk/portfolio-instruments-api";
import { HoldingCreateContext } from "../createHolding/HoldingCreateContext";

export type HoldingUpdateContext = HoldingCreateContext & {
    holding: Holding; // Make original holding required
    updatedHolding?: Holding;
}
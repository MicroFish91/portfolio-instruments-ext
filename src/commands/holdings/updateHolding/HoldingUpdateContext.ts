import { Holding } from "../../../sdk/types/holdings";
import { HoldingCreateContext } from "../createHolding/HoldingCreateContext";

export type HoldingUpdateContext = HoldingCreateContext & {
    holding: Holding; // Make original holding required
    updatedHolding?: Holding;
}
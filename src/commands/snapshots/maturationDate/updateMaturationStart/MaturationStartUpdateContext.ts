import { AuthContext } from "../../../AuthContext";

export type MaturationStartUpdateContext = AuthContext & {
    snapshotId: number;
    maturationDate?: string;
};
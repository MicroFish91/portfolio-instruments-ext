import { AuthContext } from "../../AuthContext";

export type MaturationUpdateContext = AuthContext & {
    snapshotId: number;
    maturationDate?: string;
};
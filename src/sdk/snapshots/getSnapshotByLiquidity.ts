import { LiquidityResource } from "../types/snapshots";

export type GetSnapshotByLiquidityApiResponse = {
    status: number;
    data?: {
        resources: LiquidityResource[];
        liquid_total: number;
        field_type: string;
    };
    error?: string;
};

export async function getSnapshotByLiquidity(token: string, snapshotId: number): Promise<GetSnapshotByLiquidityApiResponse> {
    const response = await fetch(`http://localhost:3000/api/v1/snapshots/${snapshotId}?group_by=LIQUIDITY`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotByLiquidityApiResponse;
}

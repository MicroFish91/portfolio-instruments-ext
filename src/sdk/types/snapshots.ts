export type Snapshot = {
    snap_id: number;
    description: string;
    snap_date: string;
    total: number;
    weighted_er_pct: number;
    benchmark_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
};

export type SnapshotValue = {
    snap_val_id: number;
    snap_id: number;
    account_id: number;
    holding_id: number;
    total: number;
    skip_rebalance: boolean;
    user_id: number;
    created_at: string;
    updated_at: string;
};

export type AssetAllocation = {
    category: string;
    value: number;
};

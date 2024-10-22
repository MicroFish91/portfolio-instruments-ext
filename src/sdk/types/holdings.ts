export enum AssetCategory {
    Cash = "CASH",
    Bills = "BILLS",
    Stb = "STB",
    Itb = "ITB",
    Ltb = "LTB",
    Commodities = "COMMODITIES",
    Gold = "GOLD",
    Reits = "REITS",
    Tsm = "TSM",
    Dlcb = "DLCB",
    Dlcg = "DLCG",
    Dlcv = "DLCV",
    Dmcb = "DMCB",
    Dmcg = "DMCG",
    Dmcv = "DMCV",
    Dscg = "DSCG",
    Dscb = "DSCB",
    Dscv = "DSCV",
    Ilcb = "ILCB",
    Ilcg = "ILCG",
    Ilcv = "ILCV",
    Imcb = "IMCB",
    Imcg = "IMCG",
    Imcv = "IMCV",
    Iscb = "ISCB",
    Iscg = "ISCG",
    Iscv = "ISCV",
    Other = "OTHER",
};

export type Holding = {
    holding_id: number;
    name: string;
    ticker?: string;
    asset_category: AssetCategory;
    expense_ratio_pct?: number;
    maturation_date?: string;
    interest_rate_pct?: number;
    is_deprecated: boolean;
    user_id: number;
    created_at: string;
    updated_at: string;
};
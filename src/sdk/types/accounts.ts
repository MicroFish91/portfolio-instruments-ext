export enum TaxShelter {
    Taxable = "TAXABLE",
    Traditional = "TRADITIONAL",
    Roth = "ROTH",
    HSA = "HSA",
    FiveTwentyNine = "529",
}

export type Account = {
    account_id: number;
    name: string;
    description?: string;
    tax_shelter: TaxShelter;
    institution: string;
    is_deprecated: boolean;
    user_id: number;
    created_at: string;
    updated_at: string;
};
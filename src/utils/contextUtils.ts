export function createContextValue(values: string[]): string {
    return Array.from(new Set(values)).sort().join(';');
}
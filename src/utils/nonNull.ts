export function nonNullProp<TSource, TKey extends keyof TSource>(source: TSource, name: TKey): NonNullable<TSource[TKey]> {
    const value: NonNullable<TSource[TKey]> = <NonNullable<TSource[TKey]>>source[name];
    return nonNullValue(value, <string>name);
}

export function nonNullValue<T>(value: T | undefined, propertyNameOrMessage?: string): T {
    if (isNullOrUndefined(value)) {
        throw new Error(
            'Internal error: Expected value to be neither null nor undefined'
            + (propertyNameOrMessage ? `: ${propertyNameOrMessage}` : ''));
    }

    return value;
}

export function nonNullValueAndProp<TSource, TKey extends keyof TSource>(source: TSource | undefined, name: TKey): NonNullable<TSource[TKey]> {
    return nonNullProp(nonNullValue(source, <string>name), name);
}

function isNullOrUndefined(value: unknown): value is null | undefined {
    return value === null || value === undefined;
}

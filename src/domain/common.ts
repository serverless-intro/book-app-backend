export class ValidationError extends Error {
    static NAME = 'ValidationError';

    constructor(errorMessage: string) {
        super(errorMessage);
        this.name = ValidationError.NAME;
    }
}



export function assert(attributeName: string | undefined) {
    return {
        of(value: string | undefined) {
            const trimmedValue = value && value.trim();
            return {
                isNotEmpty() {
                    if (!trimmedValue) {
                        throw new ValidationError(`${attributeName} must not be null`);
                    }
                    return this;
                },
                isNotLongerThan(maxLength: number) {
                    if (trimmedValue && trimmedValue.length > maxLength) {
                        throw new ValidationError(`Max length of ${attributeName} is ${maxLength}`);
                    }
                    return this;
                },
                matches(regExp: RegExp) {
                    if (trimmedValue && !regExp.test(trimmedValue)) {
                        throw new ValidationError(`${attributeName} does not match ${regExp.source}`);
                    }
                    return this;
                }
            };
        }
    };
}

import { Disposable, InputBox, InputBoxOptions, window } from "vscode";
import { operationCancelled } from "../constants";

export type InputBoxValidationResult = Awaited<ReturnType<Required<InputBoxOptions>['validateInput']>>;

export async function showInputBox(options: InputBoxOptions): Promise<string> {
    const disposables: Disposable[] = [];

    try {
        const inputBox: InputBox = window.createInputBox();
        inputBox.title = options.title;
        inputBox.prompt = options.prompt;
        inputBox.value = options.value ?? '';
        inputBox.password = !!options.password;
        inputBox.placeholder = options.placeHolder;
        inputBox.ignoreFocusOut = options.ignoreFocusOut ?? true;
        inputBox.valueSelection = options.valueSelection;

        let latestValidation: Promise<InputBoxValidationResult> = options.validateInput ? Promise.resolve(options.validateInput(inputBox.value)) : Promise.resolve('');
        return await new Promise<string>((resolve, reject) => {
            disposables.push(
                inputBox.onDidChangeValue(async value => {
                    if (options.validateInput) {
                        const validation: Promise<InputBoxValidationResult> = Promise.resolve(options.validateInput(value));
                        latestValidation = validation;

                        const message: InputBoxValidationResult = await validation;
                        if (validation === latestValidation) {
                            inputBox.validationMessage = message || '';
                        }
                    }
                }),
                inputBox.onDidAccept(async () => {
                    inputBox.enabled = false;
                    inputBox.busy = true;

                    const validateInputResult: InputBoxValidationResult = await latestValidation;
                    if (!validateInputResult) {
                        resolve(inputBox.value);
                    } else if (validateInputResult) {
                        inputBox.validationMessage = validateInputResult;
                    }

                    inputBox.enabled = true;
                    inputBox.busy = false;
                }),
                inputBox.onDidHide(() => {
                    reject(new Error(operationCancelled));
                }),
                inputBox,
            );
            inputBox.show();
        });
    } finally {
        disposables.forEach(d => d.dispose());
    }
}
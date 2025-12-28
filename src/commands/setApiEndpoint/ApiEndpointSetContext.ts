import { CommandContext } from "../registerCommand";

export type ApiEndpointSetContext = CommandContext & {
    newApiEndpoint?: string;
};
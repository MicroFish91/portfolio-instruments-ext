/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Disposable, EventEmitter, FileChangeType, FileType, l10n, window, workspace, type Event, type FileChangeEvent, type FileStat, type FileSystemProvider, type TextDocument, Uri } from "vscode";
import { ext } from "../../extensionVariables";
import { SnapshotsItem } from "../../tree/snapshots/SnapshotsItem";
import { CreateSnapshotPayload, CreateSnapshotValuePayload } from "../../sdk/snapshots/createSnapshot";
import { SnapshotDraftItem } from "../../tree/snapshots/draft/SnapshotDraftItem";
import { nonNullValue } from "../../utils/nonNull";
import { getSnapshotLatest } from "../../sdk/snapshots/getSnapshot";
import { getAuthToken } from "../../utils/tokenUtils";

const notSupported: string = l10n.t('This operation is not currently supported.');

export class SnapshotDraftFile implements FileStat {
    type: FileType = FileType.File;
    size: number;
    ctime: number;
    mtime: number;

    contents: Uint8Array;

    constructor(
        contents: Uint8Array, // snapshot_values
        readonly parentItem: SnapshotsItem,
        private _snapshotData: Omit<CreateSnapshotPayload, 'snapshot_values'>,
    ) {
        this.contents = contents;
        this.size = contents.byteLength;
        this.ctime = Date.now();
        this.mtime = Date.now();
    }

    get snapshotData(): Omit<CreateSnapshotPayload, 'snapshot_values'> {
        return this._snapshotData;
    }

    set snapshotData(payload: Omit<CreateSnapshotPayload, 'snapshot_values'>) {
        this._snapshotData = payload;
    }
}

/**
 * File system provider that allows for reading/writing/deploying snapshot revision drafts
 *
 * Enforces a policy of one revision draft per email
 */
export class SnapshotDraftFileSystem implements FileSystemProvider {
    static readonly scheme: string = 'piSnapshotDrafts';

    private readonly emitter: EventEmitter<FileChangeEvent[]> = new EventEmitter<FileChangeEvent[]>();
    get onDidChangeFile(): Event<FileChangeEvent[]> {
        return this.emitter.event;
    }

    private readonly bufferedEvents: FileChangeEvent[] = [];
    private fireSoonHandle?: NodeJS.Timeout;

    private draftStore: Map<string, SnapshotDraftFile> = new Map();

    createSnapshotDraft(parentItem: SnapshotsItem, snapshotPayload: Omit<CreateSnapshotPayload, 'snapshot_values'>, snapshotValuesPayload: CreateSnapshotValuePayload[]): void {
        const uri: Uri = this.buildUri(parentItem.email);
        if (this.draftStore.has(uri.path)) {
            return;
        }

        const file: SnapshotDraftFile = new SnapshotDraftFile(
            Buffer.from(JSON.stringify(snapshotValuesPayload, undefined, 4)),
            parentItem,
            snapshotPayload
        );
        this.draftStore.set(uri.path, file);
        this.fireSoon({ type: FileChangeType.Created, uri });

        ext.portfolioInstrumentsTdp.refresh(parentItem);
    }

    parseSnapshotDraft(email: string): CreateSnapshotPayload | undefined {
        const uri: Uri = this.buildUri(email);
        if (!this.draftStore.has(uri.path)) {
            return undefined;
        }

        const file: SnapshotDraftFile = nonNullValue(this.draftStore.get(uri.path));
        const partialSnapshotPayload: Omit<CreateSnapshotPayload, "snapshot_values"> = file.snapshotData;
        return { ...partialSnapshotPayload, snapshot_values: JSON.parse(this.readFile(uri).toString()) as CreateSnapshotValuePayload[] };
    }

    readFile(uri: Uri): Uint8Array {
        const contents = this.draftStore.get(uri.path)?.contents;
        return contents ? Buffer.from(contents) : Buffer.from('');
    }

    hasSnapshotDraft(email: string): boolean {
        const uri: Uri = this.buildUri(email);
        return this.draftStore.has(uri.path);
    }

    getSnapshotDraftFile(email: string): SnapshotDraftFile | undefined {
        const uri: Uri = this.buildUri(email);
        return this.draftStore.get(uri.path);
    }

    stat(uri: Uri): FileStat {
        const file: SnapshotDraftFile | undefined = this.draftStore.get(uri.path);

        if (file) {
            return {
                type: file.type,
                ctime: file.ctime,
                mtime: file.mtime,
                size: file.size
            };
        } else {
            return { type: FileType.File, ctime: 0, mtime: 0, size: 0 };
        }
    }

    async editSnapshotDraft(item: SnapshotDraftItem): Promise<void> {
        const uri: Uri = this.buildUri(item.email);
        if (!this.draftStore.has(uri.path)) {
            this.createSnapshotDraft(
                item.parent,
                item.snapshotData,
                (await getSnapshotLatest(nonNullValue(await getAuthToken(item.email)))).data?.snapshot_values ?? [],
            );
        }

        const textDoc: TextDocument = await workspace.openTextDocument(uri);
        await window.showTextDocument(textDoc);
    }

    writeFile(uri: Uri, contents: Uint8Array): void {
        const file: SnapshotDraftFile | undefined = this.draftStore.get(uri.path);
        if (!file || (Buffer.from(file.contents).equals(Buffer.from(contents)))) {
            return;
        }

        file.contents = contents;
        file.size = contents.byteLength;
        file.mtime = Date.now();

        this.draftStore.set(uri.path, file);
        this.fireSoon({ type: FileChangeType.Changed, uri });

        ext.portfolioInstrumentsTdp.refresh(file.parentItem);
    }

    async updateSnapshotDraft(item: SnapshotDraftItem, snapshot: Omit<CreateSnapshotPayload, "snapshot_values">): Promise<void> {
        const uri: Uri = this.buildUri(item.email);
        if (!this.draftStore.has(uri.path)) {
            this.createSnapshotDraft(
                item.parent,
                item.snapshotData,
                (await getSnapshotLatest(nonNullValue(await getAuthToken(item.email)))).data?.snapshot_values ?? [],
            );
        }

        const file: SnapshotDraftFile = nonNullValue(this.draftStore.get(uri.path));
        file.snapshotData = snapshot;
    }

    async updateSnapshotValuesDraft(item: SnapshotDraftItem, snapshotValues: CreateSnapshotValuePayload[]): Promise<void> {
        const uri: Uri = this.buildUri(item.email);
        if (!this.draftStore.has(uri.path)) {
            this.createSnapshotDraft(
                item.parent,
                item.snapshotData,
                (await getSnapshotLatest(nonNullValue(await getAuthToken(item.email)))).data?.snapshot_values ?? [],
            );
        }

        const newContent: Uint8Array = Buffer.from(JSON.stringify(snapshotValues, undefined, 4));
        this.writeFile(uri, newContent);
    }

    discardSnapshotDraft(item: SnapshotDraftItem): void {
        const uri: Uri = this.buildUri(item.email);
        if (!this.draftStore.has(uri.path)) {
            return;
        }
        this.delete(uri);
        ext.portfolioInstrumentsTdp.refresh(item.parent);
    }

    delete(uri: Uri): void {
        this.draftStore.delete(uri.path);
        this.fireSoon({ type: FileChangeType.Deleted, uri });
    }

    private buildUri(email: string): Uri {
        return Uri.parse(`${SnapshotDraftFileSystem.scheme}:/${email}.pi-snapshot.json`);
    }

    // Adapted from: https://github.com/microsoft/vscode-extension-samples/blob/master/fsprovider-sample/src/fileSystemProvider.ts
    fireSoon(...events: FileChangeEvent[]): void {
        this.bufferedEvents.push(...events);

        if (this.fireSoonHandle) {
            clearTimeout(this.fireSoonHandle);
        }

        this.fireSoonHandle = setTimeout(() => {
            this.emitter.fire(this.bufferedEvents);
            this.bufferedEvents.length = 0;
        }, 5);
    }

    watch(): Disposable {
        return new Disposable((): void => { /** Do nothing */ });
    }

    readDirectory(): [string, FileType][] {
        throw new Error(notSupported);
    }

    createDirectory(): void {
        throw new Error(notSupported);
    }

    rename(): void {
        throw new Error(notSupported);
    }
}

# TODO: Drag & Drop Migration to Server-Side Ordering

## Frontend Tasks

- [ ] **Implement the actual API call in `updateSnapshotValueOrder.ts`**
  - Uncomment the fetch implementation
  - Replace placeholder return value
  - Test error handling

- [ ] **Test the complete flow**
  - [ ] Create new snapshot from draft → verify values appear in draft order
  - [ ] Drag & drop on snapshot with NO `value_order` set → verify it works
  - [ ] Drag & drop sets `value_order` on server → verify persistence
  - [ ] Refresh tree after reordering → verify order maintained from server
  - [ ] Test with multiple snapshots → verify orders are independent
  - [ ] Test error scenarios (network failure, invalid IDs, etc.)

## Optional Cleanup

- [ ] **Clear old client-side cache**
  - Consider if you need a migration script to clean up old `globalState` entries
  - Keys like `"order:/users/{email}/snapshots/{id}/snapshotValues"`
  - Not critical since they won't be read anymore, but nice for cleanup

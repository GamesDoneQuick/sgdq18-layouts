'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// Ours
const nodecgApiContext = require("./util/nodecg-api-context");
const nodecg = nodecgApiContext.get();
const log = new nodecg.Logger(`${nodecg.bundleName}:sortable-list`);
nodecg.listenFor('sortable-list:moveItemUp', (data) => {
    moveItem(data, 'up');
});
nodecg.listenFor('sortable-list:moveItemDown', (data) => {
    moveItem(data, 'down');
});
function moveItem(data, direction) {
    // Error if the replicant isn't an array, or doesn't have any items.
    const replicant = nodecg.Replicant(data.replicantName, data.replicantBundle);
    if (!replicant || !Array.isArray(replicant.value) || replicant.value.length <= 0) {
        log.error('Replicant must be an array, and must have a length greater than zero.');
        return;
    }
    // Error if the item is not found.
    if (data.itemIdField.length > 0) {
        const actualItemIndex = replicant.value.findIndex((item) => item && item[data.itemIdField] === data.itemId);
        if (typeof actualItemIndex !== 'number' || actualItemIndex < 0 || isNaN(actualItemIndex)) {
            log.error('Item not found with these args:', data);
            return;
        }
        // Error if the provided index does not match the actual found index.
        if (actualItemIndex !== data.itemIndex) {
            log.error('Expected item index %s, got %s. Full data:', data.itemIndex, actualItemIndex, data);
            return;
        }
    }
    // Abort if moving the item up, and it can't be moved up any further.
    if (data.itemIndex === 0 && direction === 'up') {
        return;
    }
    // Abort if moving the item down, and it can't be moved down any further.
    if (data.itemIndex === (replicant.value.length - 1) && direction === 'down') {
        return;
    }
    const newIndex = direction === 'up' ? (data.itemIndex - 1) : (data.itemIndex + 1);
    const newArray = replicant.value.slice(0);
    newArray.splice(newIndex, 0, newArray.splice(data.itemIndex, 1)[0]);
    replicant.value = newArray;
}
//# sourceMappingURL=sortable-list.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoredAttrs = {
    ui2wx: {
        'ui-text': ['block'],
        'ui-rich-text': ['selectable'],
        'ui-progress': ['border-radius'],
        'ui-checkbox': ['type'],
        'ui-picker': ['is-chain', 'date-format'],
        'ui-radio': ['label'],
        'ui-switch': ['title', 'animate']
    }, wx2ui: {
        'progress': ['active-mode'],
        'button': ['open-type', 'app-parameter', 'bindgetuserinfo', 'lang', 'session-from', 'send-message-title', 'send-message-path', 'send-message-img', 'show-message-card', 'bindcontact', 'bindgetphonenumber', 'binderror'],
        'form': ['report-submit'],
        'input': ['confirm-type', 'confirm-hold', 'cursor-spacing', 'cursor', 'selection-start', 'selection-end', 'adjust-position', 'bindconfirm'],
        'textarea': ['confirm-type', 'confirm-hold', 'cursor-spacing', 'cursor', 'show-confirm-bar', 'selection-start', 'selection-end', 'adjust-position', 'bindlinechange', 'bindconfirm'],
        'navigator': ['delta']
    }
};

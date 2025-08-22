const Utils = {
    /**
     * 一意のIDを生成します。
     * @returns {string} UUID v4
     */
    generateUUID() {
        return crypto.randomUUID();
    },

    /**
     * 現在の時刻をISO 8601形式の文字列で取得します。
     * @returns {string}
     */
    getCurrentISOTime() {
        return new Date().toISOString();
    },

    /**
     * HTML表示用に文字列をエスケープします。
     * @param {string} str - エスケープする文字列
     * @returns {string} エスケープされた文字列
     */
    escapeForHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"\/]/g, (match) => {
            const escape = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;'
            };
            return escape[match];
        });
    },

    /**
     * ISO 8601形式の日付文字列を「YYYY-MM-DD HH:mm」形式にフォーマットします。
     * @param {string} isoString - ISO 8601形式の文字列
     * @returns {string} フォーマットされた日付文字列
     */
    formatDateTime(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    },

    /**
     * CSVの値としてエスケープ処理を行います。
     * @param {*} val - エスケープする値
     * @returns {string} エスケープされたCSV文字列
     */
    escapeCSV(val) {
        if (val === null || val === undefined) {
            return '';
        }
        let str = String(val);
        // ダブルクオート、カンマ、改行が含まれる場合はダブルクオートで囲む
        if (str.includes('"') || str.includes(',') || str.includes('\n')) {
            // 内部のダブルクオートは2つにエスケープ
            str = str.replace(/"/g, '""');
            return `"${str}"`;
        }
        return str;
    }
};
const idb = (() => {
    return {
        open(databaseName) {
            return new Promise((resolve, reject) => {
                const openRequest = window.indexedDB.open(databaseName, 1);

                openRequest.onupgradeneeded = migrate;

                openRequest.onsuccess = (event) => {
                    const db = event.target.result;

                    // ...
                };

                openRequest.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        }
    };

    /// Oppretter databasen for oss.
    function migrate(event) {
        event.target.result.createObjectStore('mesanClients', { autoIncrement: true });
    }
})();

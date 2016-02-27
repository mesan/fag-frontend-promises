var idb = (() => {
    // Opens (and, if needed, migrates) an IndexedDB connection.
    function open(databaseName) {
        return new Promise((resolve, reject) => {
            var openRequest = window.indexedDB.open(databaseName, 1);

            openRequest.onupgradeneeded = migrate;

            openRequest.onsuccess = event => {
                var db = event.target.result;

                resolve(createPromisedDb(db));
            };

            openRequest.onerror = reject;
        });
    }

    // Extends the IDBDatabase object with a promisedTransaction method.
    function createPromisedDb(db) {
        var promisedDb = Object.create(db);

        promisedDb.promisedTransaction = (objectStores, accessMode) => {
            var transaction = db.transaction(objectStores, accessMode);
            return createPromisedTransaction(transaction);
        };

        return promisedDb;
    }

    // Extends the IDBTransaction with a promisedObjectStore method.
    function createPromisedTransaction(transaction) {
        var promisedTransaction = Object.create(transaction);

        promisedTransaction.promisedObjectStore = objectStoreName => {
            var objectStore = transaction.objectStore(objectStoreName);
            return createPromisedObjectStore(objectStore);
        };

        return promisedTransaction;
    }

    // Overrides the get, getAll, add, put, delete and clear methods 
    // of the IDBOBjectStore object.
    function createPromisedObjectStore(objectStore) {
        var promisedObjectStore = Object.create(objectStore);

        // Promisifying object store's methods.
        ['get', 'getAll', 'add', 'put', 'delete', 'clear']
            .forEach(method => {
                promisedObjectStore[method] = function () {
                    return new Promise((resolve, reject) => {
                        // Proxying function arguments to object store.
                        var request = objectStore[method].apply(objectStore, arguments);

                        request.onsuccess = event => resolve({
                            target: {
                                source: promisedObjectStore,
                                result: event.target.result
                            }
                        });

                        request.onerror = reject;
                    });
                };
        });

        return promisedObjectStore;
    }

    /// Create database.
    function migrate(event) {
        event.target.result.createObjectStore('mesanClients', { keyPath: 'name' });
    }

    // Expose open method to app.js.
    return { open };
})();

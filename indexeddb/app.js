(() => {

    // For view implementation, check out view.js file.
    var view = viewFactory({
        
        // Triggered when "Create / Reset Clients" button is clicked.
        onResetClientsClicked() {
            openObjectStore('readwrite')
                .then(resetClients)
                .then(getAllClients)
                .then(view.renderApp)
                .catch(handleErrorEvent);
        },

        // Triggered when "Add Client" button is clicked.
        onAddClientClicked(client) {
            openObjectStore('readwrite')
                .then(objectStore => addClient(objectStore, client))
                .then(getAllClients)
                .then(view.renderApp)
                .catch(handleErrorEvent);
        },
        
        // Triggered when one of the "Move Consultant here" buttons are clicked.
        onMoveConsultantsClicked(toClient) {
            openObjectStore('readwrite')
                .then(objectStore => moveConsultants(objectStore, toClient))
                .then(getAllClients)
                .then(view.renderApp)
                .catch(handleErrorEvent);
        }
    });

    // Display all clients after the page loads.
    getAllClients().then(view.renderApp);


    // Convenience methods following...
    
    // Simply opens a promised object store.
    function openObjectStore(accessModeParam) {
        var accessMode = accessModeParam || 'readonly';

        return idb.open('MesanClientsDB')
            .then(db => db
                .promisedTransaction('mesanClients', accessMode)
                .promisedObjectStore('mesanClients'))
            .catch(err => console.error(err.stack));
    }

    // Creates / resets the list of clients.
    function resetClients(objectStore) {
        return objectStore.clear()
            .then(() => Promise.all([
                objectStore.put({ name: 'Client A', count: 16 }),
                objectStore.put({ name: 'Client B', count: 3 })
            ]));
    }

    // Adds a client with the given name and a count of zero.
    function addClient(objectStore, clientName) {
        return objectStore.add({ name: clientName, count: 0 });
    }

    // Moves a consultant from the first available client to the given client.
    function moveConsultants(objectStore, toClient) {
        objectStore.getAll()
            .then(event => event.target.result)
            .then(clients => clients.filter(client => 
                client.name !== toClient.name &&
                client.count))
            .then(clientsWithConsultants => clientsWithConsultants[0])
            .then(fromClient => {
                if (!fromClient) {
                    throw Error('No available client from which to move consultants!');
                }

                var modifiedFromClient = {
                    name: fromClient.name,
                    count: fromClient.count - 1
                };

                var modifiedToClient = {
                    name: toClient.name,
                    count: toClient.count + 1
                };

                return Promise.all([
                    objectStore.put(modifiedFromClient),
                    objectStore.put(modifiedToClient)
                ]);
            });
    }

    // Returns all clients in the object store.
    // [!!!] getAll method requires Chrome v48 or Firefox v27.
    function getAllClients() {
        return openObjectStore()
            .then(objectStore => objectStore.getAll())
            .then(event => event.target.result);
    }

    // Handles (that is, alerts) errors.
    function handleErrorEvent(event) {
        // Handle errors from IndexedDB.
        if (event && event.target && event.target.error) {
            return alert(event.target.error);
        }

        alert(event)
    }
})();
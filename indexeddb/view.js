// Creates a view object that:
//   1. Renders the app
//   2. Dispatches events to app's handlers when user performs input
var viewFactory = (eventHandlers) => {
    var appView = document.querySelector('#app');

    // Renders the app based on the clients array.
    function renderApp(clients) {
        appView.innerHTML = '';

        var list = createClientsList(clients);

        var startButton = createButton('Create / Reset Clients', () => {
            eventHandlers.onResetClientsClicked();
        });

        var insert = document.createElement('input');
        insert.setAttribute('type', 'text');

        var insertButton = createButton('Add Client', () => {
            eventHandlers.onAddClientClicked(insert.value);
        });

        appView.appendChild(list);
        appView.appendChild(startButton);
        appView.appendChild(document.createElement('hr'));
        appView.appendChild(insert);
        appView.appendChild(insertButton);

        return appView;
    }

    // Renders the list of clients.
    function createClientsList(clients) {
        var list = document.createElement('ul');

        var totalCount = getTotalConsultantCount(clients);

        clients.forEach(client => {
            var listItem = document.createElement('li');
            
            listItem.appendChild(
                document.createTextNode(client.name + ' - ' + client.count));

            var moveButton = createButton('Move Consultant Here', () => {
                eventHandlers.onMoveConsultantsClicked(client);
            });
        
            // Disable move button if no clients are available.
            if (client.count === totalCount) {
                moveButton.setAttribute('disabled', '');
            }

            listItem.appendChild(moveButton);
            list.appendChild(listItem);
        });

        return list;
    }

    // Creates a button element with text and a click listener.
    function createButton(text, listener) {
        var button = document.createElement('button');
        button.appendChild(document.createTextNode(text));
        button.addEventListener('click', listener);
        return button;
    }

    // Utility method for calculating total number of consultants.
    function getTotalConsultantCount(clients) {
        return clients.map(client => client.count)
            .reduce((sum, count) => sum + count, 0);
    }

    // Expose renderApp method to app.js.
    return { renderApp };
};
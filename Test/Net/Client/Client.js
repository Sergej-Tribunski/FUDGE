"use strict";
var ClientTest;
(function (ClientTest) {
    var ƒ = FudgeCore;
    var ƒClient = FudgeNet.FudgeClient;
    ƒ.Debug.setFilter(ƒ.DebugConsole, ƒ.DEBUG_FILTER.ALL);
    let idRoom;
    // Create a FudgeClient for this browser tab
    let client = new ƒClient();
    // keep a list of known clients, updated with information from the server
    let clientsKnown = {};
    window.addEventListener("load", start);
    async function start(_event) {
        document.forms[0].querySelector("button#connect").addEventListener("click", connectToServer);
        document.forms[0].querySelector("button#rename").addEventListener("click", rename);
        document.forms[0].querySelector("button#mesh").addEventListener("click", structurePeers);
        document.forms[0].querySelector("button#host").addEventListener("click", structurePeers);
        document.forms[0].querySelector("button#disconnect").addEventListener("click", structurePeers);
        document.forms[0].querySelector("fieldset#rooms").addEventListener("click", hndRoom);
        document.forms[0].querySelector("button#reset").addEventListener("click", structurePeers);
        document.forms[1].querySelector("fieldset").addEventListener("click", sendMessage);
        createTable();
    }
    function hndRoom(_event) {
        if (!(_event.target instanceof HTMLButtonElement))
            return;
        let command = _event.target.textContent;
        switch (command) {
            case "Get":
                client.dispatch({ command: FudgeNet.COMMAND.ROOM_GET_IDS, route: FudgeNet.ROUTE.SERVER });
                break;
            case "Create":
                client.dispatch({ command: FudgeNet.COMMAND.ROOM_CREATE, route: FudgeNet.ROUTE.SERVER });
                break;
            case "Join":
                let idRoom = document.forms[0].querySelector("fieldset#rooms>input").value;
                console.log("Enter", idRoom);
                client.dispatch({ command: FudgeNet.COMMAND.ROOM_ENTER, route: FudgeNet.ROUTE.SERVER, content: { room: idRoom } });
                break;
                break;
        }
    }
    async function connectToServer(_event) {
        let domServer = document.forms[0].querySelector("input[name=server");
        try {
            // connect to a server with the given url
            client.connectToServer(domServer.value);
            await delay(1000);
            // document.forms[0].querySelector("button#login").removeAttribute("disabled");
            document.forms[0].querySelector("button#mesh").removeAttribute("disabled");
            document.forms[0].querySelector("button#host").removeAttribute("disabled");
            document.forms[0].querySelector("input#id").value = client.id;
            // install an event listener to be called when a message comes in
            client.addEventListener(FudgeNet.EVENT.MESSAGE_RECEIVED, receiveMessage);
        }
        catch (_error) {
            console.log(_error);
            console.log("Make sure, FudgeServer is running and accessable");
        }
    }
    async function rename(_event) {
        let domProposeName = document.forms[0].querySelector("input[name=proposal]");
        let domName = document.forms[0].querySelector("input[name=name]");
        domName.value = domProposeName.value;
        // associate a readable name with this client id
        client.loginToServer(domName.value);
    }
    async function receiveMessage(_event) {
        if (_event instanceof MessageEvent) {
            let message = JSON.parse(_event.data);
            if (message.command != FudgeNet.COMMAND.SERVER_HEARTBEAT && message.command != FudgeNet.COMMAND.CLIENT_HEARTBEAT)
                showMessage(message);
            switch (message.command) {
                case FudgeNet.COMMAND.SERVER_HEARTBEAT:
                    if (client.name == undefined)
                        proposeName();
                    updateTable();
                    // on each server heartbeat, dispatch this clients heartbeat
                    client.dispatch({ idRoom: idRoom, command: FudgeNet.COMMAND.CLIENT_HEARTBEAT });
                    break;
                case FudgeNet.COMMAND.CLIENT_HEARTBEAT:
                    let span = document.querySelector(`#${message.idSource} span`);
                    blink(span);
                    break;
                    break;
                case FudgeNet.COMMAND.DISCONNECT_PEERS:
                    client.disconnectPeers();
                    break;
                case FudgeNet.COMMAND.ROOM_GET_IDS:
                    document.forms[0].querySelector("fieldset#rooms>textarea").value = message.content.rooms.toString();
                    break;
                case FudgeNet.COMMAND.ROOM_CREATE:
                    console.log("Created room", message.content.room);
                case FudgeNet.COMMAND.ROOM_ENTER:
                    client.dispatch({ command: FudgeNet.COMMAND.ROOM_GET_IDS, route: FudgeNet.ROUTE.SERVER });
                    break;
                default:
                    break;
            }
            return;
        }
        else
            console.table(_event);
    }
    function delay(_milisec) {
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, _milisec);
        });
    }
    function proposeName() {
        // search for a free number i to use for the proposal of the name "Client" + i
        let domProposeName = document.forms[0].querySelector("input[name=proposal");
        if (document.activeElement == domProposeName)
            return; // don't interfere when user's at the element
        let i = 0;
        for (; Object.values(client.clientsInfoFromServer).find(_info => _info.name == "Client-" + i); i++)
            ;
        domProposeName.value = "Client-" + i;
    }
    function createTable() {
        let table = document.querySelector("table");
        let html = `<tr><th>&nbsp;</th><th>name</th><th>id</th><th>data</th><th>signal</th><th>connection</th><th>gather</th><th>ice</th></tr>`;
        html += `<tr><td><span>0</span></td><td>Server</td><td>&nbsp;</td><td>&nbsp;</td></tr>`;
        table.innerHTML = html;
    }
    function updateTable() {
        let table = document.querySelector("table");
        let span = document.querySelector(`td>span`); // first cell is server blinker
        blink(span);
        for (let id in clientsKnown)
            if (!client.clientsInfoFromServer[id])
                deleteRow(id);
        // each client keeps information about all clients
        clientsKnown = client.clientsInfoFromServer;
        for (let id in clientsKnown) {
            let name = clientsKnown[id].name;
            let isHost = clientsKnown[id].isHost;
            let peer = client.peers[id];
            let row = table.querySelector(`#${id}`);
            if (row) {
                row.querySelector("td[name=name]").textContent = name + (isHost ? " (HOST)" : "");
                row.querySelector("td[name=data]").textContent = peer?.dataChannel?.readyState;
                row.querySelector("td[name=signal]").textContent = peer?.signalingState;
                row.querySelector("td[name=connection]").textContent = peer?.connectionState;
                row.querySelector("td[name=gather]").textContent = peer?.iceGatheringState;
                row.querySelector("td[name=ice]").textContent = peer?.iceConnectionState;
            }
            else {
                row = document.createElement("tr");
                table.appendChild(row);
                let html;
                html = `<tr id="${id}"><td><span>0</span></td><td name="name">${name}</td><td name="id">${id}</td>`;
                html += `<td name="data"></td>`;
                html += `<td name="signal"></td>`;
                html += `<td name="connection"></td>`;
                html += `<td name="gather"></td>`;
                html += `<td name="ice"></td></tr>`;
                row.outerHTML = html;
            }
        }
    }
    function deleteRow(_id) {
        let table = document.querySelector("table");
        let row = table.querySelector(`tr#${_id}`);
        table.removeChild(row.parentElement);
    }
    function blink(_span) {
        let newSpan = document.createElement("span");
        newSpan.textContent = (parseInt(_span.textContent) + 1).toString().padStart(3, "0");
        _span.parentElement.replaceChild(newSpan, _span);
    }
    function structurePeers(_event) {
        let button = _event.target;
        switch (button.textContent) {
            case "create mesh":
                // creates an RTC-Mesh, where all clients are directly connected to one another
                client.createMesh();
                break;
            case "become host":
                // creates a host structure, where all other clients are connected to this client but not to each other
                client.becomeHost();
                break;
            case "disconnect":
                client.disconnectPeers();
                break;
            default:
                // send a command to dismiss all RTC-connections
                client.dispatch({ idRoom: idRoom, command: FudgeNet.COMMAND.DISCONNECT_PEERS, route: FudgeNet.ROUTE.VIA_SERVER });
        }
    }
    function sendMessage(_event) {
        let formdata = new FormData(document.forms[1]);
        let protocol = formdata.get("protocol").toString();
        let message = formdata.get("message").toString();
        let ws = protocol == "ws";
        let receiver = formdata.get("receiver").toString();
        switch (_event.target.id) {
            //TODO insert idRoom in dispatch
            case "sendServer":
                // send the message to the server only
                client.dispatch({ idRoom: idRoom, route: FudgeNet.ROUTE.SERVER, content: { text: message } });
                break;
            case "sendHost":
                // send the message to the host via RTC or TCP
                client.dispatch({ idRoom: idRoom, route: ws ? FudgeNet.ROUTE.VIA_SERVER_HOST : FudgeNet.ROUTE.HOST, content: { text: message } });
                break;
            case "sendAll":
                // send the message to all clients (no target specified) via RTC (no route specified) or TCP (route = via server)
                client.dispatch({ idRoom: idRoom, route: ws ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { text: message } });
                break;
            case "sendClient":
                // send the message to a specific client (target specified) via RTC (no route specified) or TCP (route = via server)
                client.dispatch({ idRoom: idRoom, route: ws ? FudgeNet.ROUTE.VIA_SERVER : undefined, idTarget: receiver, content: { text: message } });
                break;
        }
    }
    function showMessage(_message) {
        console.table(_message);
        if (_message.command)
            return;
        let received = document.forms[1].querySelector("textarea#received");
        let line = (_message.route || "toPeer") + " > " + _message.idSource + "(" + clientsKnown[_message.idSource].name + "):" + JSON.stringify(_message.content);
        received.value = line + "\n" + received.value;
    }
})(ClientTest || (ClientTest = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQ2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFVLFVBQVUsQ0FpUG5CO0FBalBELFdBQVUsVUFBVTtJQUNsQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDckIsSUFBTyxPQUFPLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztJQUN0QyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEQsSUFBSSxNQUFjLENBQUM7SUFFbkIsNENBQTRDO0lBQzVDLElBQUksTUFBTSxHQUFZLElBQUksT0FBTyxFQUFFLENBQUM7SUFDcEMseUVBQXlFO0lBQ3pFLElBQUksWUFBWSxHQUEyRCxFQUFFLENBQUM7SUFFOUUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUV2QyxLQUFLLFVBQVUsS0FBSyxDQUFDLE1BQWE7UUFDaEMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDN0YsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25GLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztRQUN6RixRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUs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
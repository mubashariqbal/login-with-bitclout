function login() {
    identityWindow = window.open('https://identity.bitclout.com/log-in', null, 'toolbar=no, width=800, height=1000, top=0, left=0');    
}

function handleInit(e) {
    if (!init) {
        init = true;
        iframe = document.getElementById("identity");

        for (const e of pendingRequests) {
            postMessage(e);
        }
        
        pendingRequests = []
    }
    respond(e.source, e.data.id, {})
}

function handleLogin(payload) {
    console.log(payload);
    if (identityWindow) {
        identityWindow.close();
        identityWindow = null;

        var element = document.getElementById('loggedin');
        element.innerText = 'Logged in as ' + payload.publicKeyAdded;
    }
}

function respond(e, t, n) {
    e.postMessage({
        id: t,
        service: "identity",
        payload: n
    }, "*")    
}

function postMessage(e) {
    init ? this.iframe.contentWindow.postMessage(e, "*") : pendingRequests.push(e)    
}

// const childWindow = document.getElementById('identity').contentWindow;
window.addEventListener('message', message => {
    console.log('message: ');
    // console.log(message);

    const {data: {id: id, method: method, payload: payload}} = message;    

    console.log(id);
    console.log(method);
    console.log(payload);

    if (method == 'initialize') {
        handleInit(message);
    } else if (method == 'login') {
        handleLogin(payload);
    }
});

var init = false;
var iframe = null;
var pendingRequests = [];
var identityWindow = null;

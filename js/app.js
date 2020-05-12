var dataArray = [];

async function downloadData() {
    const blob = new Blob([dataArray], {type: 'text/csv;charset=utf-8;'});
    const url = [URL.createObjectURL(blob)]

    const link = document.createElement('a');
    link.href = url;
    // link.download = "data";
    window.open(blob);
    link.click();
    link.remove();

}


let m;

let cbConnecting = function() {
    document.querySelector('#connect').innerText = 'Connecting';
    document.querySelector('#connect').disabled = true;
    document.querySelector('#monitor-information').textContent = 'Please wait...';
};

let cbConnected = function() {
    document.querySelector('#connect').innerText = 'Disconnect';
    document.querySelector('#connect').disabled = false;

    m.getMonitorInformation()
        .then(monitorInformation => {
            let mi = document.querySelector('#monitor-information');
            mi.textContent = 'FW: ' + monitorInformation.firmwareRevision + ' | ' +
                'HW: ' + monitorInformation.hardwareRevision + ' | ' +
                'MNF: '+ monitorInformation.manufacturerName + ' | ' +
                'SN: ' + monitorInformation.serialNumber;
        })
        .catch(error => {
            document.querySelector('#monitor-information').textContent = error;
        });

};

let cbDisconnected = function() {
    document.querySelector('#connect').innerText = 'Connect';
    document.querySelector('#connect').disabled = false;
    document.querySelector('#monitor-information').textContent = '';
};

let cbMessage = function(m) {
    let div = document.getElementById(m.type);
    if (!div) {
        div = document.createElement('div');
        div.id = m.type;
        document.querySelector('#notifications').appendChild(div);
    }

    /* iterate data elements and create / update value */
    for (let k in m.data) {
        if (m.data.hasOwnProperty(k)) {
            let selector = '#' + m.type + ' span.' + k;
            let s = document.querySelector(selector);
            if (!s) {
                let p = document.createElement('div');      /* one block per item */

                let desc = document.createElement('span');
                desc.className = 'element';
                desc.textContent = pm5fields[k].label;

                s = document.createElement('span');         /* create item */
                s.className = 'value ' + k;

                p.appendChild(desc);                        /* key name */
                p.appendChild(s);                           /* data element */
                div.appendChild(p);                         /* append block to container */

                p.addEventListener('click', function(e) {
                    toggleClass(this, 'highlight');
                });
            }
            s.textContent = pm5fields[k].printable(m.data[k]);
            // if (s.className === "value strokePower") {
            //     socket.emit('message', 'power,' + s.textContent.slice(0,-1));
            //     // console.log(s.textContent.slice(0,-1))
            // }
        }
    }
};

document.addEventListener('DOMContentLoaded', function(e) {
    m = new PM5(cbConnecting,
        cbConnected,
        cbDisconnected,
        cbMessage);

    document.querySelector('#connect').addEventListener('click', function() {
        if (!navigator.bluetooth) {
            alert('Web Bluetooth is not supported! You need a browser and ' +
                'platform that supports Web Bluetooth to use this application.');
        }

        if (m.connected()) {
            m.doDisconnect();
        } else {
            m.doConnect();
        }
    });

    // document.querySelector('#toggle-instructions').addEventListener('click', function() {
    //     let e = document.querySelector('#instruction-text');
    //     let button_text = 'Show instructions';

    //     toggleClass(e, 'hidden');
    //     if (!e.classList.contains('hidden')) {
    //         button_text = 'Hide instructions';
    //     }

    //     document.querySelector('#toggle-instructions').innerText = button_text;
    // });


    document.querySelector("#test-flow").addEventListener("click", onTestButtonClick);
    document.querySelector("#connect-flow").addEventListener("click", onFlowButtonClick);
    document.querySelector("#connect-flow-ribcage").addEventListener("click", onFlowRibcageButtonClick);
    document.querySelector("#connect-hr").addEventListener("click", onHeartRateButtonClick);
    document.querySelector("#stop-flow").addEventListener('click', onStopFlowClick);
    document.querySelector("#stop-flow").addEventListener('click', onStopFlowRibcageClick);
    document.querySelector("#stop-hr").addEventListener('click', onStopHeartRateClick);

    document.querySelector("#download").addEventListener('click', downloadData);



});

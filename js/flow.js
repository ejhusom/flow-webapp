/* 
Web bluetooth api script for BreathZpot sensors. 
Adapted from the following source: https://googlechrome.github.io/samples/web-bluetooth/notifications-async-await.html

Copyright 2019 Eigil Aandahl

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/
class Flow {
    constructor(name) {
        this.name = name;

        this.flowCharacteristic;
        this.values = [];
        this.maxVal = 0;
        this.minVal = 4096;
        this.canvas = document.querySelector('#' + this.name + 'Chart');
        this.onFlowButtonClick = this._onFlowButtonClick.bind(this);
        this.onStopFlowClick = this._onStopFlowClick.bind(this);
        this.handleFlowNotifications = this._handleFlowNotifications.bind(this);
        this.boundHandling = this.handleFlowNotifications.bind(this);
        // this.handleFlowNotifications = e => this.handleFlowNotifications(e);
    }

    async _onFlowButtonClick() {

        let serviceUuid = 0xffb0; // BreathZpot breathing service
        serviceUuid = parseInt(serviceUuid);

        let characteristicUuid = 0xffb3; // BreathZpot breathing characteristic
        characteristicUuid = parseInt(characteristicUuid);

        try {
            console.log('Requesting Bluetooth Device...');
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: [serviceUuid] }]
            });

            console.log('Connecting to GATT Server...');
            const server = await device.gatt.connect();

            console.log('Getting Service...');
            const service = await server.getPrimaryService(serviceUuid);

            console.log('Getting Characteristic...');
            this.flowCharacteristic = await service.getCharacteristic(characteristicUuid);

            // this.flowCharacteristic.addEventListener('characteristicvaluechanged',
            //     handleFlowNotifications);
            // this.bound = evt => this.handleFlowNotifications(evt);
            let object = this;
            console.log(object);
            this.flowCharacteristic.addEventListener('characteristicvaluechanged',
                function (event) {
                    
                    // pompel(event, object);
                    object.handleFlowNotifications(event, object);


                    //let value = event.target.value;
                    //let id = event.target.service.device.id;
                    //let int16View = new Int16Array(value.buffer);
                    //let timestamp = new Date().getTime();
                    //// TextDecoder to process raw data bytes.
                    //for (let i = 0; i < 7; i++) {
                    //    //Takes the 7 first values as 16bit integers from each notification
                    //    //This is then sent as a string with a sensor signifier as OSC using osc-web
                    //    socket.emit('message', timestamp + ',abdomen,' + int16View[i].toString() + ',' + (timestamp - 600 + i * 100));
                    //    // dataArray.push('\n' + timestamp + ',abdomen,' + int16View[i].toString() + ',' + (timestamp - 600 + i * 100))

                    //    let v = int16View[i];

                    //    if (v > object.maxVal) {
                    //        object.maxVal = v;
                    //    }
                    //    if (v < object.minVal) {
                    //        object.minVal = v;
                    //    }

                    //    object.values.push(v);
                    //}
                    //document.getElementById(object.name + "Text").innerHTML = object.name + ": " + int16View[0].toString();

                    //let valueRange = object.maxVal - object.minVal;
                    //var plotValues = object.values.map(function (element) {
                    //    return (element - object.minVal) / valueRange;
                    //});

                    //if (object.values.length > 200) {
                    //    object.values.splice(0, 7);
                    //}
                    //drawWaves(plotValues, object.canvas, 1, 6.0);
                });
                // this.arrow);
                // this.bound);
            //     function(){self.handleFlowNotifications});
                // function(event){this.handleFlowNotifications(event)});
                // function(event){self.handleFlowNotifications(event)});
            // this.flowCharacteristic.addEventListener('characteristicvaluechanged',
            //     function (e) {
            //         this.handleFlowNotifications(e)
            //     });

            await this.flowCharacteristic.startNotifications();
            console.log('> Notifications started');


        } catch (error) {
            console.log('Argh! ' + error);
        }

    }

    async _onStopFlowClick() {
        if (this.flowCharacteristic) {
            try {
                await this.flowCharacteristic.stopNotifications();
                console.log('> Notifications stopped');
                this.flowCharacteristic.removeEventListener('characteristicvaluechanged',
                    handleFlowNotifications);
            } catch (error) {
                console.log('Argh! ' + error);
            }
        }
    }

    _handleFlowNotifications(event, object) {
        console.log("finally");
        let value = event.target.value;
        let id = event.target.service.device.id;
        let int16View = new Int16Array(value.buffer);
        let timestamp = new Date().getTime();
        // TextDecoder to process raw data bytes.
        for (let i = 0; i < 7; i++) {
            //Takes the 7 first values as 16bit integers from each notification
            //This is then sent as a string with a sensor signifier as OSC using osc-web
            socket.emit('message', timestamp + ',abdomen,' + int16View[i].toString() + ',' + (timestamp - 600 + i * 100));
            // dataArray.push('\n' + timestamp + ',abdomen,' + int16View[i].toString() + ',' + (timestamp - 600 + i * 100))

            let v = int16View[i];

            if (v > object.maxVal) {
                object.maxVal = v;
            }
            if (v < object.minVal) {
                object.minVal = v;
            }

            object.values.push(int16View[i]);
        }
        document.getElementById(object.name + "Text").innerHTML = object.name + ": " + int16View[0].toString();

        let valueRange = object.maxVal - object.minVal;
        var plotValues = object.values.map(function (element) {
            return (element - object.minVal) / valueRange;
        });

        if (object.values.length > 200) {
            object.values.splice(0, 7);
        }
        drawWaves(plotValues, object.canvas, 1, 6.0);

    }

}

function pompel(event, object) {
    console.log("pompel");
    let value = event.target.value;
    let id = event.target.service.device.id;
    let int16View = new Int16Array(value.buffer);
    let timestamp = new Date().getTime();
    // TextDecoder to process raw data bytes.
    for (let i = 0; i < 7; i++) {
        //Takes the 7 first values as 16bit integers from each notification
        //This is then sent as a string with a sensor signifier as OSC using osc-web
        socket.emit('message', timestamp + ',abdomen,' + int16View[i].toString() + ',' + (timestamp - 600 + i * 100));
        // dataArray.push('\n' + timestamp + ',abdomen,' + int16View[i].toString() + ',' + (timestamp - 600 + i * 100))

        let v = int16View[i];

        if (v > object.maxVal) {
            object.maxVal = v;
        }
        if (v < object.minVal) {
            object.minVal = v;
        }

        object.values.push(int16View[i]);
    }
    document.getElementById(object.name + "Text").innerHTML = object.name + ": " + int16View[0].toString();

    let valueRange = object.maxVal - object.minVal;
    var plotValues = object.values.map(function (element) {
        return (element - object.minVal) / valueRange;
    });

    if (object.values.length > 200) {
        object.values.splice(0, 7);
    }
    drawWaves(plotValues, object.canvas, 1, 6.0);

}

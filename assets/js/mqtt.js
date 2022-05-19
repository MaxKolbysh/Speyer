let host = 'sgrg.saint-gobain.com';
let port = 443;
let topic = 'VALUE/DE0161-SGR/TESTSENSORS/EF389C/TEMPERATURE';
let username = 'websocket';
let pw = 'ws-secret';
let useTLS = true;
let cleansession = true;
let reconnectTimeout = 3000;
let tempData = new Array();
let mqtt;




let cliendId = "mqtt_panel" + parseInt(Math.random() * 100);

function MQTTconnect() {
    if (typeof path == "undefined") {
        path = '/mqtt';
    }
    
    mqtt = new Paho.MQTT.Client(host, port, path, cliendId, 10);
    
    let options = {
        timeout: 3,
        useSSL: useTLS,
        cleanSession: cleansession,
        onSuccess: onConnect,
		userName: username,
		password: pw,
        onFailure: function (message) {
            $('#status').html("Connection failed: " + message.errorMessage + "Retrying...")
                .attr('class', 'alert alert-danger');
            setTimeout(MQTTconnect, reconnectTimeout);
        }
    };

    mqtt.onConnectionLost = onConnectionLost;
    mqtt.onMessageArrived = onMessageArrived;
    console.log("Host: " + host + ", Port: " + port + ", Path: " + path + " TLS: " + useTLS + 'ClientId' + cliendId);
    mqtt.connect(options);
};

function onConnect() {
    $('#status').html('Connected to ' + host + ':' + port + path)
        .attr('class', 'alert alert-success');
    mqtt.subscribe(topic, { qos: 0 });
    $('#topic').html(topic);

    $("#connection-status").html("Connected").attr('class', 'alert alert-success');  // connection status in menu highlight


};



function onConnectionLost(response) {
    setTimeout(MQTTconnect, reconnectTimeout);
    $('#status').html("Connection lost. Reconnecting...")
        .attr('class', 'alert alert-warning');
    $("#connection-status").html("Connection lost").attr('class', 'alert alert-warning');   // disconnection status in menu highlight 
};






const topicArray = [];   
topicArray.push(topic);   // array for tests 


$(document).ready(function(){
    let i =1; 
    $("#hotspottopic").change(function(){
        let userMessageTopic = document.getElementById("hotspottopic").value;
        
        if (topicArray.includes(userMessageTopic) ){
            
            i++;
            $("#sensor-container").prepend(i);
            

            
        }else {
            console.log("not right name");
        }


      
    });
  });








function onMessageArrived(message) {
    let topic = message.destinationName;
    let payload = message.payloadString;

    
    
    
   
    


   


   
   
    console.log("Topic: " + topic + ", Message payload: " + payload);
    $('#message').html(topic + ', ' + payload);
    
	$('#mqtt-topic').text(topic + ':');
	$('#mqtt-value-label').text(payload + ' °C');
    
	$('#mqtt-value-label').addClass('badge-default');
    
    $('#mqttdata').html('Temp is: ' +payload + ' °C');
    $('#mqttdatadinamic').html('Temp is: ' +payload + ' °C');
    
    $('[data-sensorId="sensor-1"]').html(topic);
    $('[data-sensorId="sensor-2"]').html(topic);
    $('[data-sensorId="sensor-3"]').html(topic); 
    $('[data-sensorId="sensor-4"]').html(topic);
    $('[data-sensorId="sensor-5"]').html(topic);

    $('[data-sensorval="sensor-1"]').html(payload );
    $('[data-sensorval="sensor-2"]').html(payload );
    $('[data-sensorval="sensor-3"]').html(payload );
    $('[data-sensorval="sensor-4"]').html(payload );
    $('[data-sensorval="sensor-5"]').html(payload );
	
    /*
    tempData.push({
		"timestamp": Date().slice(16, 21),
		"temperature": parseInt(payload)
	});
	if (tempData.length >= 10) {
		tempData.shift()
	}
	drawChart(tempData);
*/
    
 };
/*
function drawChart(data) {
    let ctx = document.getElementById("chart").getContext("2d");


    let temperatures = []
    let timestamps = []

    data.map((entry) => {
        temperatures.push(entry.temperature);
        timestamps.push(entry.timestamp);
    });

    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [{
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: temperatures
            }]
        },
        options: {
            legend: {
                display: false
            }
        }
    });
}
*/

   


$(document).ready(function () {
  /* drawChart(tempData); */ 
    MQTTconnect();
});


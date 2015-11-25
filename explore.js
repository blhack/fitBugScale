var noble = require("noble");

var peripherals = {};
var peripheralId = process.argv[2];
var gData;

noble.on("discover", function(peripheral) {
	//console.log("I saw peripheral with Uuid: " + peripheral.uuid);
	peripherals[peripheral.uuid] = peripheral;
	
	if (peripheral.uuid == peripheralId) {
		//console.log("I found the device you told me to find");
		noble.stopScanning();
		discoverDevice(peripheral.uuid);
	}
});

function handleData(data) {
	//console.log("Some notification data came in!");
	//console.log(data);
	//console.log(data[01]);
	weight = ((data[02] * 255) + data[1]) * 100;
	lbs = weight * 0.0022046
	console.log("Your weight in lbs is: " + lbs);
	scan();
}

function discoverDevice(peripheralUuid) {
	//console.log("Discovering device " + peripheralUuid);
	//console.log("First connecting to device...");
	device = peripherals[peripheralUuid];

	device.connect(function(error) {
		peripherals[peripheralUuid].discoverAllServicesAndCharacteristics(function(error, services, characteristics) {
			//console.log("Discover calling back.");
			//console.log(error);
			for (var i=0; i<characteristics.length; i++) {
				if (characteristics[i].properties.indexOf("indicate") != -1) {
					//console.log(characteristics[i].properties);
					characteristics[i].notify("true", function(error) { });
					characteristics[i].on("read", handleData);
				}
			}
		});
	})
}


function showCharacteristics(peripheralUuid) {
	//console.log(peripherals[peripheralUuid]["characteristics"]);
}

function scan() {
	var peripherals = {};
	noble.startScanning();
}

function stopScanning() {
	noble.stopScanning();
	}

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

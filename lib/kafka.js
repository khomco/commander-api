var kafka = require('kafka-node');

var KafkaClient = (function () {
    var instance;

    function init() {
        var client = new kafka.Client();
        var producer = undefined;
        return {
            producer: function () {
                if (producer === undefined) {
                    Producer = kafka.Producer;
                    producer = new Producer(client);
                    producer.on('ready', () => {
                        console.log("Successfully connected to kafka");
                    });
                    producer.on('error', (error) => {
                        console.error("Failed to connect to kafka");
                        console.error(error);
                    });
                }
                return producer;
            },
            sendMessage: function (topics, message) {
                return new Promise((resolve, reject) => {
                    if (producer === undefined) {
                        console.error("Producer client has not been initialized");
                        throw new Error("Producer client has not been initialized");
                    }
                    var payloads = [
                        {topic: topics, messages: message, partition: 0}
                    ];
                    producer.send(payloads, function (err, data) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            }
        };
    };
    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();

module.exports = KafkaClient;

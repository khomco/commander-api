var kafka = require('kafka-node');
var util = require('util');

var KafkaClient = (function () {
    var instance;

    function init() {
        this.createClient = function() {
            var host = process.env.KAFKA_HOST || 'localhost';
            var port = process.env.KAFKA_PORT || '2181';
            var url = util.format("%s:%s/", host, port);
            console.log("Connecting to Kafka at %s", url);
            return new kafka.Client();
        };

        var client = this.createClient();
        var producer = undefined;

        return {
            producer: function () {
                if (producer === undefined) {
                    Producer = kafka.Producer;
                    producer = new Producer(client);
                    producer.on('ready', () => {
                        console.log("Successfully connected to Kafka");
                    });
                    producer.on('error', (error) => {
                        console.error("Failed to connect to Kafka");
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

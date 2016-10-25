var kafka = require('kafka-node');
var util = require('util');
var Q = require('kew');

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

        this.producer = function () {
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
        };

        var client = this.createClient();
        var producer = this.producer();

        return {
            sendMessage: function (topics, message) {
                var deferred = Q.defer();
                if (producer === undefined) {
                    console.error("Producer client has not been initialized");
                    throw new Error("Producer client has not been initialized");
                }
                var payloads = [
                    {topic: topics, messages: message, partition: 0}
                ];
                producer.send(payloads, function (err, data) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        var response = {
                            payload: message,
                            data: data
                        }
                        deferred.resolve(response);
                    }
                });

                return deferred.promise;
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

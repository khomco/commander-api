var express = require('express');
var registry = require('../registry/commands');
var router = express.Router();
var kafka = require('../lib/kafka');
var kafka_producer = kafka.getInstance();

router.post('/commands', function (req, res) {
    console.log("Received command: " + JSON.stringify(req.body))
    var command = registry.lookupCommand(req);
    if (command === undefined) {
        res.status(400).json({"message": "command was not accepted"})
    } else {
        command.validate(function (result) {
            if (result.errors.length > 0) {
                res.status(400)
                    .json({"message": "Command payload was invalid", "reason": JSON.stringify(result.errors)})
            } else {
                command.transform(function (data) {
                    kafka_producer.sendMessage("commands", data)
                        .then(() => {
                            res.status(200).json({"message": "success"});
                        });
                });
            }
        });
    }
});

module.exports = router;

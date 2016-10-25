var express = require('express');
var registry = require('../registry/commands');
var router = express.Router();
var kafka = require('../lib/kafka');
var kafka_producer = kafka.getInstance();

router.post('/commands', (req, res) => {
    console.log("Received command: " + JSON.stringify(req.body))
    var command = registry.lookupCommand(req);
    if (command === undefined) {
        res.status(400).json({"message": "command was not accepted"})
    } else {
        command.validate((result) => {
            if (result.errors.length > 0) {
                res.status(400)
                    .json({"message": "Command payload was invalid", "reason": JSON.stringify(result.errors)})
            } else {
                command.transform((command_payload) => {
                    console.log("Sending %s  to topic", JSON.stringify(command_payload));
                    kafka_producer.sendMessage("commands", command_payload)
                        .then((response) => {
                            res.status(200).json({message: "command successfully persisted", "id": response.payload.id});
                        });
                });
            }
        });
    }
});

module.exports = router;

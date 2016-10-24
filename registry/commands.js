var Registry = require('node-registry');

module.exports = {
    lookupCommand: function(command_request) {
        try {
            console.log("looking up command " + command_request.body.action)
            var command = command_request.lookup(command_request.body.action)
            command.setPayload(command_request.body)
            return command
        } catch (ex) {
            console.log(ex);
            return undefined;
        }
    }
}
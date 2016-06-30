/**
 * @providesModule WarningHandlers
 */

var warningHandlers = []

function register(handler) {
  warningHandlers.push(handler);
}

function unregister(handler) {
  warningHandlers.splice(warningHandlers.indexOf(handler), 1);
}

function callAll(msg) {
  warningHandlers.forEach(function(handler) {
    handler(msg);
  });
}

module.exports = {
  register: register,
  unregister: unregister,
  call: callAll,
}

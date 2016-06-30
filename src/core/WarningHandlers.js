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

module.exports = {
  register: register,
  unregister: unregister,
}

var Growl = (function() {
  // Look for the container element, and if it is not found, create it!
  var findOrCreateContainer = function() {
    // Try finding the container element first
    var growlContainer = document.getElementById("growl-container");

    // If we can not find it, let's create it
    if (!growlContainer) {
      growlContainer= document.createElement("div");
      growlContainer.id = "growl-container";
      growlContainer.className = "growl-container";
      document.body.appendChild(growlContainer);
    }

    return growlContainer;
  };

  // Main function which does the heavy lifting
  var show = function(args) {
    var growl, message, title, growlContainer, timeoutHandle;

    // Set default arguments, if they are missing
    args.message = args.message || "";
    args.type = args.type || "notice";
    args.timeout = args.timeout || 2500;

    // Create the growl message
    growl = document.createElement("div");
    message = document.createTextNode(args.message);

    // If there is a title specified, create it
    if (args.title && typeof(args.title) === "string") {
      title = document.createElement("strong");
      title.className = "title";
      title.appendChild(document.createTextNode(args.title));

      growl.appendChild(title);
    }

    growl.appendChild(message); // Append the message to the element
    growl.className = "growl growl-" + args.type; // Set the class for the growl message

    // Remove the element after some specified time.
    // We store the timeoutHandle, since we need it later
    timeoutHandle = setTimeout(function() {
      growl.parentNode.removeChild(growl);
    }, args.timeout);

    // If the growl message is clicked, remove it and clear the timeout function
    growl.onclick = function() {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      growl.parentNode.removeChild(growl);
    };

    growlContainer = findOrCreateContainer();
    growlContainer.appendChild(growl);
  };

  // Notice messages
  var notice = function(args) {
    // If args is a string, simple show a message with default arguments
    if (typeof(args) === "string") {
      show({message: args});
    }
    else {
      show({
        message: args.message,
        title: args.title,
        type: "notice",
        timeout: args.timeout
      });
    }
  };

  // Error messages
  var error = function(args) {
    if (typeof(args) === "string") {
      show({message: args, type: "error"});
    }
    else {
      show({
        message: args.message,
        title: args.title,
        type: "error",
        timeout: args.timeout
      });
    }
  };

  // Warning messages
  var warn = function(args) {
    if (typeof(args) === "string") {
      show({message: args, type: "warn"});
    }
    else {
      show({
        message: args.message,
        title: args.title,
        type: "warn",
        timeout: args.timeout
      });
    }
  };

  // Expose the functions we want to the world!
  return {
    Notice: notice,
    Warn: warn,
    Error: error
  };
})(this);

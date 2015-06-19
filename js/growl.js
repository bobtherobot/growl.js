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
    var growl, growlContainer, timeoutHandle, transLiveHandle, transOutHandle,
        type, timeout, transin, transout;

    // Set default arguments, if they are missing
    type = args.type || "notice";

	// Must parse integers to convert strings to numbers, 
	// especially if the values come from a form.
    timeout = parseInt(args.timeout) || 2500;
	transin = parseInt(args.transin) || 220; // set to 0 to eliminate transition
	transout = parseInt(args.transout) || 720; // set to 0 to eliminate transition
	
    // Create the growl wrapper
    growl = document.createElement("div");

    // If there is a title specified, create it
    if (args.title) {
      var title = document.createElement("div");
      title.className = "growl-title";
      title.appendChild(document.createTextNode(args.title));
      growl.appendChild(title);
    }

	// If there is a message specified, create it
    if (args.message) {
      var message = document.createElement("div");
      message.className = "growl-message";
      message.appendChild(document.createTextNode(args.message));
      growl.appendChild(message);
    }

	// Set the transitions 
	var s = growl.style; // to shorten the next line.
	s.webkitTransition = s.mozTransition = s.transition = "all " + transin + "ms ease-in";
	
	// Set the classes, inlcuding the "begin"
	growl.className = "growl growl-" + type + " growl-begin"; 
    
	// Store timeout handles so we can cancel them if / when user 
	// clicks (and do general cleanup upon completion).
	
	// Wait until transition "in" time is complete before setting 
	// the "live" class, thus allowing the transition to occur.
	transLiveHandle = setTimeout(function() {
	  // Essentially replacing the "begin" class with the "live" class.
      growl.className = "growl growl-" + type + " growl-live"; 
    }, transin);

	// Set the "end" class at the user-defined "timeout".
	transOutHandle = setTimeout(function() {
	  // Essentially replacing the "live" class with the "end" class.
      growl.className = "growl growl-" + type + " growl-end"; 
    }, timeout);

    // Remove the element after some specified time.
    timeoutHandle = setTimeout(function() {
      destroy(growl);
    }, timeout + transout);

    function destroy(elem){
	  if (transLiveHandle) {
        clearTimeout(transLiveHandle);
      }
      if (transOutHandle) {
        clearTimeout(transOutHandle);
      }
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      elem.parentNode.removeChild(elem);
	}
	
    // If the growl message is clicked, remove it and clear the timeout function
    growl.onclick = function() {
      destroy(growl);
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

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
})(this);

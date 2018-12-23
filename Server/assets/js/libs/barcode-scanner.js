function barcodeScanner(callback) {
  // only init when the page has loaded
  $(document).ready(function () {
    // variable to ensure we wait to check the input we are receiving
    // you will see how this works further down
    var pressed = false;
    // Variable to keep the barcode when scanned. When we scan each
    // character is a keypress and hence we push it onto the array. Later we check
    // the length and final char to ensure it is a carriage return - ascii code 13
    // this will tell us if it is a scan or just someone writing on the keyboard
    var chars = [];
    var lastChar;
    // trigger an event on any keypress on this webpage
    $(window).keypress(function (e) {
      // save last char in a variable
      lastChar = e.which;
      // check if key was `enter`
      if (e.which != 13) {
        chars.push(String.fromCharCode(e.which));
      }
      // Pressed is initially set to false so we enter - this variable is here to stop us setting a
      // timeout everytime a key is pressed. It is easy to see here that this timeout is set to give 
      // us 1 second before it resets everything back to normal. If the keypresses have not matched 
      // the checks in the readBarcodeScanner function below then this is not a barcode
      if (pressed == false) {
        // we set a timeout function that expires after 1 sec, once it does it clears out a list 
        // of characters 
        setTimeout(function () {
          // check if last char was enter
          if (lastChar == 13) {
            // join the chars array to make a string of the barcode scanned
            var barcode = chars.join("");
            // assign value to some input (or do whatever you want)
            callback(barcode);
          }
          chars = [];
          pressed = false;
        }, 200);
      }
      // set press to true so we do not reenter the timeout function above
      pressed = true;
    });
  });
}
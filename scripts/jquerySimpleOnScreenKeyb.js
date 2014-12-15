/**
 * Plugin which provides a simple on screen keyboard
 */
(function($) {
  $.fn.simpleOnScreenKeyb = function(options) {

    // the input element itself
    var elem = this;

    var defaults = {
      "chars": ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '<span class="glyphicon glyphicon-chevron-left"></span>', '<span class="glyphicon glyphicon-arrow-down"></span>'],
      "keys": {
        38: "nextChar",
        40: "prevChar",
        27: "cancle",
        13: "enter"
      },
      "blurHandler": null
    }

    $.extend(defaults, $.fn.simpleOnScreenKeyb.defaults, options);

    var currCharPos = 0;

    var toLower = false;

    var popover = $(elem).popover({
      "content": "",
      "trigger": "manual",
      "title": "Select char"
    })



    // append some html to the box

    /**
     * Event handling
     */
    elem.on('keyup', function(e) {
      handleKeybKey(e.which);
    });

    elem.focusin(function() {
      $(elem).popover("show");
      displayChar(currCharPos);
    });

    elem.focusout(function() {
      $(elem).popover('hide');
    });


    elem.blur(function() {
      $(elem).popover('hide');
    });


    /**
     * Handles the key code from the keyboard
     */
    var handleKeybKey = function(keyCode) {
      var actionForKey = defaults.keys[keyCode];
      if (actionForKey !== undefined) {
        switch (actionForKey) {
          case "nextChar":
            if (currCharPos == defaults.chars.length - 1) {
              currCharPos = 0;
            } else {
              currCharPos++;
            }
            displayChar(currCharPos);
            break;
          case "prevChar":
            if (currCharPos == 0) {
              currCharPos = defaults.chars.length - 1;
            } else {
              currCharPos--;
            }
            displayChar(currCharPos);
            break;
          case "enter":
            var currText = elem.val();
            // delete selected
            if (currCharPos == defaults.chars.length - 2) {
              currText = currText.slice(0, -1)
            } else if (currCharPos == defaults.chars.length - 1) {
              toLower = !toLower;
              var text = '<span class="glyphicon glyphicon-arrow-down"></span>';
              if (toLower == true) {
                text = '<span class="glyphicon glyphicon-arrow-up"></span>';
              }
              defaults.chars[defaults.chars.length - 1] = text;
              displayChar(currCharPos);
            } else {
              currText += getCurrentChar();
            }
            elem.val(currText)
            break;
          case "cancle":
            if (defaults.blurHandler != null) {
              defaults.blurHandler(elem);
            }
            //elem.blur ();
            break;
        }
      }
    }

    /**
     * gets the current char
     */
    var getCurrentChar = function() {
      var char = defaults.chars[currCharPos];
      if (toLower == true) {
        char = char.toLowerCase();
      }

      return char;
    }

    /**
     * Display the current char
     */
    var displayChar = function() {
      $(elem).data('bs.popover').tip().find(".popover-content").html(getCurrentChar());
    };

    return this;
  };



}(jQuery));

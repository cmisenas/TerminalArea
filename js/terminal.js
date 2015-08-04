function TerminalArea(id) {
  this.id = id;
  this.$el = $('#' + id);
}

TerminalArea.prototype = {
  init: function() {
    // create cursor
    // setup listeners for following events:
    //   keypress ()
    //   click (focusing in or out)
    this.initCursor();
    this.$terminal = $('<div></div>').addClass('terminal-area');
    this.$el.append(this.$terminal);
    this.initEvents();
  },

  initCursor: function() {
    this.index = 0;
    this.$fakeCursorEl = $('<div></div>').addClass('terminal-area-cursor-fake');
    this.$el.append(this.$fakeCursorEl);
    if (this.$el.attr('focus') === 'true') {
      this.focus();
      this.setCurrentCursor(this.$fakeCursorEl);
    }
  },

  initEvents: function() {
    var self = this;
    $(document).on('keypress', function(e) {
      console.log(e.keyCode);
      if (self.state) {
        self.cursorBlur();
        self.type(String.fromCharCode(e.keyCode));
        self.setCurrentCursor(self.$cursorEl);
      }
    });

    $(document).on('keydown', function(e) {
      self.cursorBlur();
    });

    $(document).on('keyup', function(e) {
      if (!$("input,textarea").is(":focus")) {
        self.focus();
      }
    });

    $(document).on('click', function(e) {
      if (!!$(e.target).closest('.terminal-area-container').length) {
        self.focus();
      } else {
        self.blur();
      }
    });
  },

  type: function(chr) {
    var currentTxt = this.$terminal.text();
    var newTxt = currentTxt.split('');
    var formatChr = '';
    if (chr === ' ') {
      formatChr = '<span style="display: inline-block; width: 1em" class="terminal-area-cursor">' + chr + '</span>';
    } else {
      formatChr = '<span class="terminal-area-cursor">' + chr + '</span>';
    }
    newTxt.splice(this.index, 0, formatChr);
    this.$terminal.html(newTxt.join(''));
    this.$cursorEl = $('.terminal-area-cursor');
    this.forwardCursor();
  },

  setCurrentCursor: function(el) {
    this.deactiveCursors();
    this.currentCursor = el;
  },

  deactiveCursors: function() {
    this.$fakeCursorEl.removeClass('active');
    if (this.$cursorEl) this.$cursorEl.removeClass('active');
  },

  forwardCursor: function() {
    this.index++;
  },

  backCursor: function() {
    this.index--;
  },

  focus: function() {
    this.state = true;
    this.cursorBlink();
  },

  blur: function() {
    this.state = false;
    this.cursorBlur();
  },

  cursorBlink: function() {
    var self = this;
    this.cursorBlur();
    this.blinking = setInterval(function() {
      self.currentCursor.toggleClass('active');
    }, 750);
  },

  cursorBlur: function() {
    this.deactiveCursors();
    clearInterval(this.blinking);
  }
}


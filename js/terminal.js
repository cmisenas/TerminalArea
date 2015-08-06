function TerminalArea(id) {
  this.id = id;
  this.$el = $('#' + id);
}

TerminalArea.prototype = {
  init: function() {
    this.buffer = ' ';
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
      if (self.state) {
        self.type(String.fromCharCode(e.keyCode));
      }
    });

    $(document).on('keydown', function(e) {
      switch (e.keyCode) {
        case 37: // left
          self.backCursor();
          break;
        case 39:
          self.forwardCursor();
          break;
        case 8:
          e.preventDefault();
          self.deleteCurrent();
          break;
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
    this.setTextBuffer(chr); // inserts character in text buffer on current index
    this.forwardCursor();
  },

  deleteCurrent: function() {
    this.replaceTextBuffer('');
    this.refreshCursor();
  },

  setTextBuffer: function(chr) {
    this.buffer = this.buffer.substr(0, this.index) + chr + this.buffer.substr(this.index);
  },

  replaceTextBuffer: function(chr) {
    this.buffer = this.buffer.substr(0, this.index) + chr + this.buffer.substr(this.index + 1);
  },

  refreshCursor: function() {
    if (this.index >= this.buffer.length) {
      this.index = (!!this.buffer) ? this.buffer.length - 1 : 0;
    }
    this.setTxt(this.formatTextBuffer());
  },

  formatTextBuffer: function() {
    var chr = this.buffer[this.index] || '';
    var formatChr = '';
    if (chr === '') {
      this.setCurrentCursor(this.$fakeCursorEl);
      return '';
    } else if (chr === ' ') {
      formatChr = '<span style="display: inline-block; width: 1em" class="terminal-area-cursor">' + chr + '</span>';
    } else {
      formatChr = '<span class="terminal-area-cursor">' + chr + '</span>';
    }
    return this.buffer.substr(0, this.index) + formatChr + this.buffer.substr(this.index + 1);
  },

  setTxt: function(txt) {
    this.$terminal.html(txt);
    this.$cursorEl = $('.terminal-area-cursor');
    this.setCurrentCursor(this.$cursorEl);
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
    if ((this.index) < this.buffer.length - 1) {
      this.index++;
    }
    this.refreshCursor();
  },

  backCursor: function() {
    if ((this.index) > 0) {
      this.index--;
    }
    this.refreshCursor();
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
    this.blinking = setInterval(function() {
      if (self.state) {
        self.currentCursor.toggleClass('active');
      }
    }, 750);
  },

  cursorBlur: function() {
    this.deactiveCursors();
    clearInterval(this.blinking);
  },

  contents: function() {
    return this.$terminal.contents()
                          .toArray()
                          .reduce(function(prev, curr) {
                            return prev + ((curr.nodeType === 1) ? curr.innerText : curr.wholeText);
                          }, '');
  }
}


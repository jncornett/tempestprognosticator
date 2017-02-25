define(['backbone'], Backbone => {
  Set.prototype.equals = function(other) {
    if (this.size != other.size) {
      return false;
    }
    for (let x of this) {
      if (!other.has(x)) {
        return false;
      }
    }
    for (let x of other) {
      if (!this.has(x)) {
        return false;
      }
    }
    return true;
  };
  return Backbone.View.extend({
    events: {
      'selectionchange .words-input': 'onWordsChanged',
      'propertychange .words-input': 'onWordsChanged',
      'input .words-input': 'onWordsChanged'
    },
    initialize: function() {
      this.wordsInput = this.$('.words-input');
    },
    onWordsChanged: function() {
      const words = this.wordsInput.val().split(/\s+/mg);
      const wordSet = new Set();
      for (let word of words) {
        if (word.length > 0) {
          wordSet.add(word);
        }
      }
      const existWordSet = new Set(this.model.get('words'));
      if (!wordSet.equals(existWordSet)) {
        this.model.set('words', [...wordSet]);
      }
    },
  });
});

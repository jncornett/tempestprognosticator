'use strict';

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

$(() => {
  const WordsView = Backbone.View.extend({
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

  const QuestionTypeView = Backbone.View.extend({
    template: _.template($('#question-type-setting').html()),
    initialize: function(options) {
      this.questionType = options.questionType;
    },
    render: function() {
      this.$el = $('<div>').append(this.template({
        name: this.questionType.name
      }));
      this.el = this.$el[0];
      return this;
    }
  });

  const QuestionTypesView = Backbone.View.extend({
    events: {
      'input .slider': 'onSliderInput',
    },
    initialize: function(options) {
      this.qtViews = [];
      _.forEach(options.questionTypes, (qt) => {
        let view = new QuestionTypeView(_.extend(options, {
          questionType: qt
        }));
        this.$el.append(view.render().$el);
        this.qtViews.push(view);
      });
    },
    onSliderInput: function() {
      console.log('sliderInput', arguments);
    }
  });

  const SettingsView = Backbone.View.extend({
    initialize: function(options) {
      this.questionTypesView = new QuestionTypesView(_.extend(options, {
        el: this.$('#question-types-container')[0]
      }));
    }
  });

  const ExportView = Backbone.View.extend({});

  const CreateView = Backbone.View.extend({
    initialize: function(options) {
      this.wordsView = new WordsView({
        el: this.$('#words'),
        model: this.model
      });
      this.settingsView = new SettingsView(_.extend(options, {
        el: this.$('#settings'),
      }));
      this.exportView = new ExportView({
        el: this.$('#export'),
        model: this.model
      });
    }
  });

  const PreviewView = Backbone.View.extend({});

  // FIXME back with local storage
  const AppSettings = Backbone.Model.extend({
    defaults: function() {
      return {
        words: new Set(),
        questionGenerators: {},
        totalQuestions: 0,
        usedWords: 0,
        generated: [],
      };
    }
  });

  const AppView = Backbone.View.extend({
    initialize: function(options) {
      this.createView = new CreateView(_.extend(options, {
        el: this.$('#create'),
      }));
      this.previewView = new PreviewView({
        el: this.$('#preview'),
        model: this.model
      });
      this.listenTo(this.model, 'change', function() {
        console.log('change', arguments);
      });
    }
  });

  new AppView({
    el: $('#app'),
    model: new AppSettings,
    questionTypes: [
      {
        "name": "Word-to-definition",
        "func": function() {
          console.log("TODO add word func");
        }
      }
    ],
  });
});

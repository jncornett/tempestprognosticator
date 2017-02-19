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

const QuestionTypeModel = Backbone.Model.extend({
  defaults: {
    name: '',
    enabled: true,
  },
  idAttribute: 'name'
});

const AppSettings = Backbone.Model.extend({
  defaults: function() {
    return {
      words: new Set(),
      totalQuestions: 0,
      usedWords: 0,
      generated: [],
    };
  },
  initialize: function() {
    this.questionTypes = new Backbone.Collection({model: QuestionTypeModel});
  }
});

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
    // TODO add check/uncheck event
    template: Handlebars.compile($('#question-type-setting').html()),
    render: function() {
      this.$el = $('<div>').append(this.template(this.model.toJSON()));
      this.el = this.$el[0];
      return this;
    }
  });

  const SettingsView = Backbone.View.extend({
    initialize: function(options) {
      this.listenTo(this.model.questionTypes, 'add', this.addQuestionType);
    },
    addQuestionType: function(model) {
      const view = new QuestionTypeView({model: model});
      const el = this.$('#question-types-container');
      el.append(view.render().el);
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

  const app = new AppView({
    el: $('#app'),
    model: new AppSettings,
  });
  app.model.questionTypes.add({name: 'Foo'});
});

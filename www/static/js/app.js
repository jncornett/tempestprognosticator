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

const ExportTypeModel = Backbone.Model.extend({
  defaults: {
    name: '',
  },
  idAttribute: 'name'
});

const AppSettings = Backbone.Model.extend({
  defaults: function() {
    return {
      words: new Set(),
      totalQuestions: 0,
      usedWords: 0,
      questions: [],
    };
  },
  initialize: function() {
    this.questionTypes = new Backbone.Collection({model: QuestionTypeModel});
    this.exportTypes = new Backbone.Collection({model: ExportTypeModel});
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
    tagName: 'div',
    template: Handlebars.compile($('#question-type-setting').html()),
    events: {
      'click .ctrl-enable': 'onClick'
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.$el.html(this.template(this.model.toJSON()));
      this.$('.ctrl-help').webuiPopover({
        title: this.model.get('name'),
        content: this.model.get('help')
      });
    },
    onClick: function(e) {
      this.model.set('enabled', $(e.currentTarget).prop('checked'));
    }
  });

  const SettingsView = Backbone.View.extend({
    events: {
      'input .ctrl-num-questions': 'onNumQuestionsInput',
      'input .ctrl-num-words': 'onNumWordsInput'
    },
    initialize: function(options) {
      this.$('.ctrl-num-questions').val(this.model.get('totalQuestions'));
      this.$('.ctrl-num-words').val(this.model.get('usedWords'));
      this.listenTo(this.model.questionTypes, 'add', this.addQuestionType);
      this.listenTo(this.model, 'change', this.render);
      this.render();
    },
    render: function() {
      this.$('.ind-total-words').text(this.model.get('words').length);
      this.$('.ctrl-num-words').prop('max', this.model.get('words').length);
      this.$('.ind-num-questions').text(this.model.get('totalQuestions'));
      this.$('.ind-num-words').text(this.$('.ctrl-num-words').val());
    },
    addQuestionType: function(model) {
      const view = new QuestionTypeView({model: model});
      this.$('#question-types-container').append(view.el);
    },
    onNumQuestionsInput: function(e) {
      const val = parseInt($(e.currentTarget).val());
      this.model.set('totalQuestions', val);
    },
    onNumWordsInput: function(e) {
      const val = parseInt($(e.currentTarget).val());
      this.model.set('usedWords', val);
    }
  });

  const ExportView = Backbone.View.extend({
    events: {
      'click .ctrl-download': 'onDownload'
    },
    initialize: function(options) {
      this.listenTo(this.model.exportTypes, 'add', this.addExportType);
      console.log(options.api);
    },
    addExportType: function(model) {
      this.$('.ctrl-export-types').append($('<option>').text(model.get('name')));
    },
    onDownload: function() {
      console.log('onDownload');
    }
  });

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
        model: this.model,
        api: options.api
      });
    }
  });

  const PreviewView = Backbone.View.extend({
    initialize: function(options) {
      this.listenTo(this.model, 'change:questions', this.render);
      console.log(options.api);
    },
    render: function() {
      console.log('preview render');
    }
  });

  const AppView = Backbone.View.extend({
    initialize: function(options) {
      this.createView = new CreateView(_.extend(options, {
        el: this.$('#create'),
        api: options.api
      }));
      this.previewView = new PreviewView({
        el: this.$('#preview'),
        model: this.model,
        api: options.api
      });
    }
  });

  const app = new AppView({
    el: $('#app'),
    model: new AppSettings,
    api: new DictionaryApi
  });
  app.model.questionTypes.add({
    name: 'Foo',
    help: 'Some help'
  });
  app.model.exportTypes.add({
    name: 'Javascript (JSON)'
  });
});

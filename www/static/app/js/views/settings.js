'use strict';

define(['backbone', 'app/views/questiontype'], (Backbone, QuestionTypeView) => {
  return Backbone.View.extend({
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
});

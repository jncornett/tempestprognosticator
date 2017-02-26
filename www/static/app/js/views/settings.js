'use strict';

define(['backbone', 'app/views/questiontype'], (Backbone, QuestionTypeView) => {
  return Backbone.View.extend({
    events: {
      'input .ctrl-num-questions': 'onNumQuestionsInput'
    },
    initialize: function(options) {
      this.$('.ctrl-num-questions').val(this.model.get('totalQuestions'));
      this.listenTo(this.model.questionTypes, 'add', this.addQuestionType);
      this.listenTo(this.model, 'change', this.render);
      this.render();
    },
    render: function() {
      this.$('.ind-num-questions').text(this.model.get('totalQuestions'));
    },
    addQuestionType: function(model) {
      const view = new QuestionTypeView({model: model});
      this.$('#question-types-container').append(view.el);
    },
    onNumQuestionsInput: function(e) {
      const val = parseInt($(e.currentTarget).val());
      this.model.set('totalQuestions', val);
    }
  });
});

'use strict';

define(['backbone', 'app/quiz', 'app/exports'], (Backbone, Quiz, exports) => {
  // Prevents unnecessary re-rendering while the user is changing settings
  const renderTimeoutMs = 1000;
  return Backbone.View.extend({
    initialize: function(options) {
      this.listenTo(this.model, 'change:words', this.render);
      this.listenTo(this.model, 'change:totalQuestions', this.render);
      this.listenTo(this.model.questionTypes, 'change:enabled', this.render);
      this.api = options.api;
      this.renderTimeout = null;
      this.render();
    },
    render: function() {
      if (this.renderTimeout != null) {
        clearTimeout(this.renderTimeout);
      }
      this.renderTimeout = setTimeout(() => {
        if (this.model.get('words').length == 0) {
          this.$('#preview').html('<p>Add some words to get started</p>');
          return;
        }
        const quiz = Quiz.generateQuiz(this.api, this.model.get('words'), {
          numQuestions: this.model.get('totalQuestions'),
          questionTypes: this.model.questionTypes.where({enabled: true}).map(m => m.toJSON())
        });
        this.model.set('quiz', quiz);
        const items = Quiz.renderQuiz(this.model.questionTypes.models.map(m => m.toJSON()), quiz);
        const html = exports.exportHTML(items);
        this.$('#preview').html(html);
        this.renderTimeout = null;
      }, renderTimeoutMs);
    }
  });
});

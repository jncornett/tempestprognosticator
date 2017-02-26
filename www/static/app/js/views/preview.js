'use strict';

define(['backbone', 'app/quiz'], (Backbone, generateQuiz) => {
  // Prevents unnecessary re-rendering while the user is changing settings
  const renderTimeoutMs = 1000;
  return Backbone.View.extend({
    initialize: function(options) {
      this.listenTo(this.model, 'change:words', this.render);
      this.listenTo(this.model, 'change:totalQuestions', this.render);
      this.listenTo(this.model.questionTypes, 'change:enabled', this.render);
      this.api = options.api;
      this.renderTimeout = null;
    },
    render: function() {
      if (this.renderTimeout != null) {
        clearTimeout(this.renderTimeout);
      }
      this.renderTimeout = setTimeout(() => {
        const quiz = generateQuiz(this.api, this.model.get('words'), {
          numQuestions: this.model.get('totalQuestions'),
          questionTypes: this.model.questionTypes.where({enabled: true}).map(m => m.toJSON())
        });
        console.log('preview render', quiz);
        this.renderTimeout = null;
      }, renderTimeoutMs);
    }
  });
});

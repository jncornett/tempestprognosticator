'use strict';

define([
  'backbone',
  'app/models/questiontype',
  'app/models/exporttype'
], (Backbone, QuestionTypeModel, ExportTypeModel) => {
  return Backbone.Model.extend({
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
});

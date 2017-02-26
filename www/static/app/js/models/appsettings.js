'use strict';

define([
  'backbone',
  'app/models/questiontypes',
  'app/models/exporttypes'
], (Backbone, QuestionTypeCollection, ExportTypeCollection) => {
  return Backbone.Model.extend({
    defaults: function() {
      return {
        words: [],
        totalQuestions: 0,
        quiz: null,
      };
    },
    initialize: function() {
      this.questionTypes = new QuestionTypeCollection;
      this.exportTypes = new ExportTypeCollection;
    }
  });
});

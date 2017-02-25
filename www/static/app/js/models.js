'use strict';

define(['backbone'], Backbone => {
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

  return {
    QuestionTypeModel,
    ExportTypeModel,
    AppSettings
  };
});

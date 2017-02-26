'use strict';

define(['backbone', 'app/models/questiontype'], (Backbone, QuestionTypeModel) => {
  return Backbone.Collection.extend({
    model: QuestionTypeModel
  });
});

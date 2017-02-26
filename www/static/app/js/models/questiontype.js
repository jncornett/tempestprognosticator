'use strict';

define(['backbone'], Backbone => {
  return Backbone.Model.extend({
    defaults: {
      name: '',
      help: '',
      enabled: true,
      generate: null,
      formatQuiz: null,
      formatAnswerKey: null,
      minWords: 0,
    },
    idAttribute: 'name'
  });
});

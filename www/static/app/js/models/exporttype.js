'use strict';

define(['backbone'], Backbone => {
  return Backbone.Model.extend({
    defaults: {
      name: '',
    },
    idAttribute: 'name'
  });
});

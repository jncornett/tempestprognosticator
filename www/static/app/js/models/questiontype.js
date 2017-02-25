'use strict';

define(['backbone'], Backbone => {
  return Backbone.Model.extend({
    defaults: {
      name: '',
      enabled: true,
    },
    idAttribute: 'name'
  });
});

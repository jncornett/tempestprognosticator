'use strict';

define(['backbone'], Backbone => {
  return Backbone.Model.extend({
    defaults: {
      name: '',
      render: null,
    },
    idAttribute: 'name'
  });
});

'use strict';

define(['backbone'], Backbone => {
  return Backbone.Model.extend({
    defaults: {
      name: '',
      filename: '',
      render: null,
    },
    idAttribute: 'name'
  });
});

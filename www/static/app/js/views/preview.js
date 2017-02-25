'use strict';

define(['backbone'], Backbone => {
  return Backbone.View.extend({
    initialize: function(options) {
      this.listenTo(this.model, 'change:questions', this.render);
    },
    render: function() {
      console.log('preview render');
    }
  });
});

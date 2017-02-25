'use strict';

define(['backbone', 'handlebars', 'jquery', 'domReady!'], (Backbone, Handlebars, $) => {
  return Backbone.View.extend({
    tagName: 'div',
    template: Handlebars.compile($('#question-type-setting').html()),
    events: {
      'click .ctrl-enable': 'onClick'
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.$el.html(this.template(this.model.toJSON()));
      this.$('.ctrl-help').webuiPopover({
        title: this.model.get('name'),
        content: this.model.get('help')
      });
    },
    onClick: function(e) {
      this.model.set('enabled', $(e.currentTarget).prop('checked'));
    }
  });
});

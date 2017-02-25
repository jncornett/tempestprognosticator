'use strict';

define([
  'backbone',
  'app/views/create',
  'app/views/preview'
], (Backbone, CreateView, PreviewView) => {
  return Backbone.View.extend({
    initialize: function(options) {
      this.createView = new CreateView(_.extend(options, {
        el: this.$('#create'),
        api: options.api
      }));
      this.previewView = new PreviewView({
        el: this.$('#preview'),
        model: this.model,
        api: options.api
      });
    }
  });
});

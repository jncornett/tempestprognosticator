'use strict';

define([
  'backbone',
  'app/views/words',
  'app/views/settings',
  'app/views/export'
], (Backbone, WordsView, SettingsView, ExportView) => {
  return Backbone.View.extend({
    initialize: function(options) {
      this.wordsView = new WordsView({
        el: this.$('#words'),
        model: this.model
      });
      this.settingsView = new SettingsView(_.extend(options, {
        el: this.$('#settings'),
      }));
      this.exportView = new ExportView({
        el: this.$('#export'),
        model: this.model,
        api: options.api
      });
    }
  });
});

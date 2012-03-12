Spraycan.Views.Palettes.Index = Backbone.View.extend({
  events: {
    "click li.palette a": "show_selected"
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    var compiled = JST['spraycan/templates/selector/palettes/index'];

    $(this.el).html(compiled({ palettes : Spraycan.palettes.models }));

    $('#main').html(this.el);


    Spraycan.refresh_toolbar('colors');

    return this;
  },

  show_selected: function(sel){
    $(sel.currentTarget).parents('ul').find('li').removeClass('active');
    $(sel.currentTarget).parents('li').addClass('active');
  }

});

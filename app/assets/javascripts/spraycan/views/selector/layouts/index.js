Spraycan.Views.Layouts.Index = Backbone.View.extend({
  events: {
    "click .tabs-content li a": "show_selected"
  },

  initialize: function() {
    Spraycan.set_current('layouts', 'index');
    Spraycan.view = this;

    this.render();
  },

  render: function() {
    var compiled = JST["spraycan/templates/selector/layouts/index"];
    $(this.el).html(compiled());
    $('#main').html(this.el);

    $(".vertical-tabs").tabs();

    Spraycan.refresh_toolbar('layouts');

    return this;
  },

  show_selected: function(sel){
    $(sel.currentTarget).parents('ul').find('li').removeClass('active');
    $(sel.currentTarget).parents('li').addClass('active');
  }
});

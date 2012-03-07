Spraycan.Views.Packs.Edit = Backbone.View.extend({
  events: {
    "click input.back": "back"
  },

  initialize: function() {
    Spraycan.view = this;

    $(this.el).data('view', this);
    this.model = this.options.model;

    this.render();
  },

  save: function(event) {
    if(event!=undefined){
      event.preventDefault();
    }

    // Spraycan.clear_errors();
    attrs = $('form#new-theme-form').serializeObject();
    attrs.import = $("form#new-theme-form [name='import']").is(':checked');

    this.model.save(attrs, {
      success: function(model, resp) {
        // Spraycan.reload_styles();
      },
      error: Spraycan.handle_save_error
    });

    return false;
  },

  back: function(){
    window.location.href = "#tab-themes";
  },

  render: function() {
    var compiled = JST["spraycan/templates/selector/packs/edit"];
    $(this.el).html(compiled(this.model.toJSON()));

    $('#main').html(this.el);

    return this;
  }
});

Spraycan.Views.Images.Edit = Backbone.View.extend({
  events: {
    "click button#save": "save"
  },

  initialize: function(opts) {
    Spraycan.view = this;
    this.render();
  },

  render: function() {
    var compiled = JST["spraycan/templates/selector/images/edit"];

    $(this.el).html(compiled());
    $('#main').html(this.el);

    Spraycan.refresh_toolbar('images');

    Spraycan.enable_save();

    // enable edit / delete actions for images
    $(".chessboard").hover(function(){
      $(this).find('ul.actions').show();
    }, function(){
      $(this).find('ul.actions').hide();
    })

    //setup buttonsets
    $("#section-images-background .align .values, #section-images-background .repeat .values, #section-images-logo .align .values").buttonset();


    //--------------- FAVICON ----------------//
    // wire upload for favicon click
    $('div#favicon_uploader, #section-images-favicon .actions a.edit').click(function(){
      $('#favicon_file').trigger('click');
    });

    // handle delete icon click
    $('#section-images-favicon .actions a.delete').click(function(){
      $('#section-images-favicon .images-upload-favicon').css('background-image', 'none');
      $('#section-images-favicon .edit').removeClass('visible').addClass('hidden');
      $('#section-images-favicon .ready').removeClass('hidden').addClass('visible');

      //submit perference to server
      prefs = new Spraycan.Collections.Preferences();
      prefs.add({
        configuration: "Spraycan::Config",
        name: "favicon_file_guid",
        value: 0
      });

      Backbone.sync('create', prefs, {
        success: function(model, resp) {
          Spraycan.reload_styles();
          Spraycan.rollback.preferences.favicon_file_guid = Spraycan.preferences.favicon_file_guid;
          Spraycan.preferences.favicon_file_guid = 0;
          Spraycan.rollback.preferences.favicon_file_url = Spraycan.preferences.favicon_file_url;
          Spraycan.preferences.favicon_file_url = "";       },
        error: Spraycan.handle_save_error
      });
    });

    // handle actual favicon upload
    $('#favicon_file').change(function() {

      $('#section-images-favicon .ready').removeClass('visible').addClass('hidden');
      $('#section-images-favicon .uploading').removeClass('hidden').addClass('visible');

      $(this).upload('/spraycan/themes/' + Spraycan.theme_id + '/files.json', { 'preference': 'favicon_file_guid' }, function(res) {
        $('#section-images-favicon .uploading').removeClass('visible').addClass('hidden')

        if(res.id!="false"){
          Spraycan.rollback.preferences.favicon_file_guid = Spraycan.preferences.favicon_file_guid;
          Spraycan.preferences.favicon_file_guid = res.guid;
          Spraycan.rollback.preferences.favicon_file_url = Spraycan.preferences.favicon_file_url;
          Spraycan.preferences.favicon_file_url = res.url;

          $('#section-images-favicon .edit').removeClass('hidden').addClass('visible');
          $('#section-images-favicon .images-upload-background').css('background-image', 'url(' + Spraycan.preferences.favicon_file_url + ')');
        }
      }, 'json');
    });

    //display favicon if value already set:
    if(Spraycan.preferences.favicon_file_url!=''){
      $('#section-images-favicon .ready').removeClass('visible').addClass('hidden');
      $('#section-images-favicon .edit').removeClass('hidden').addClass('visible');
      $('#section-images-favicon .images-upload-background').css('background-image', 'url(' + Spraycan.preferences.favicon_file_url + ')');
    }


    //--------------- LOGO ----------------//
    // wire upload for click
    $('div#logo_uploader, #section-images-logo .actions a.edit').click(function(){
      $('#logo_file').trigger('click');
    });

    // handle delete icon click
    $('#section-images-logo .actions a.delete').click(function(){
      $('#section-images-logo .images-upload-logo').css('background-image', 'none');
      $('#section-images-logo .edit').removeClass('visible').addClass('hidden');
      $('#section-images-logo .ready').removeClass('hidden').addClass('visible');

      //submit perference to server
      prefs = new Spraycan.Collections.Preferences();
      prefs.add({
        configuration: "Spraycan::Config",
        name: "logo_file_guid",
        value: 0
      });

      Backbone.sync('create', prefs, {
        success: function(model, resp) {
          Spraycan.reload_styles();
          Spraycan.rollback.preferences.logo_file_guid = Spraycan.preferences.logo_file_guid;
          Spraycan.preferences.logo_file_guid = 0;
          Spraycan.rollback.preferences.logo_file_url = Spraycan.preferences.logo_file_url;
          Spraycan.preferences.logo_file_url = "";       },
        error: Spraycan.handle_save_error
      });
    });

    // handle actual logo upload
    $('#logo_file').change(function() {
      $('#section-images-logo .ready').removeClass('visible').addClass('hidden');
      $('#section-images-logo .uploading').removeClass('hidden').addClass('visible');

      $(this).upload('/spraycan/themes/' + Spraycan.theme_id + '/files.js', { 'preference': 'logo_file_guid' }, function(res) {
        $('#section-images-logo .uploading').removeClass('visible').addClass('hidden')


        if(res.id!="false"){
          Spraycan.reload_styles();

          Spraycan.rollback.preferences.logo_file_guid = Spraycan.preferences.logo_file_guid;
          Spraycan.preferences.logo_file_guid = res.guid;
          Spraycan.rollback.preferences.logo_file_url = Spraycan.preferences.logo_file_url;
          Spraycan.preferences.logo_file_url = res.url;

          $('#section-images-logo .edit').removeClass('hidden').addClass('visible');
          $('#section-images-logo .images-upload-background').css('background-image', 'url(' + Spraycan.preferences.logo_file_url + ')');
        }
      }, 'json');
    });


    //display logo if value already set:
    if(Spraycan.preferences.logo_file_url!=''){
      $('#section-images-logo .ready').removeClass('visible').addClass('hidden');
      $('#section-images-logo .edit').removeClass('hidden').addClass('visible');
      $('#section-images-logo .images-upload-background').css('background-image', 'url(' + Spraycan.preferences.logo_file_url + ')');
    }

    // align controls for logo
    var logo_align_inputs = $("#section-images-logo .align .values");
    var logo_align = "center " + logo_align_inputs.find('input:checked').attr("id").split('images-logo-align-')[1];

    $("#section-images-logo .images-upload-background").css({
      backgroundPosition: logo_align
    });

    // handle align changes
    logo_align_inputs.find('input').each(function(){
      $(this).change(function(){
        if($(this).attr("checked") == "checked"){
          var logo_align = "center " + $(this).attr("id").split('images-logo-align-')[1];
          $("#section-images-logo .images-upload-background").css({
            backgroundPosition: logo_align
          });

          //submit perference to server
          prefs = new Spraycan.Collections.Preferences();
          prefs.add({
            configuration: "Spraycan::Config",
            name: "logo_alignment",
            value: logo_align
          });

          Backbone.sync('create', prefs, {
            success: function(model, resp) {
              Spraycan.reload_styles();
              Spraycan.rollback.preferences.logo_alignment = Spraycan.preferences.logo_alignment;
              Spraycan.preferences.logo_alignment = logo_align;
            },
            error: Spraycan.handle_save_error
          });


        }
      })
    });


    //--------------- BACKGROUND ----------------//
    // wire upload for click
    $('div#background_uploader, #section-images-background .actions a.edit').click(function(){
      $('#background_file').trigger('click');
    });

    // handle delete icon click
    $('#section-images-background .actions a.delete').click(function(){
      $('#section-images-background .images-upload-background').css('background-image', 'none');
      $('#section-images-background .edit').removeClass('visible').addClass('hidden');
      $('#section-images-background .ready').removeClass('hidden').addClass('visible');

      //submit perference to server
      prefs = new Spraycan.Collections.Preferences();
      prefs.add({
        configuration: "Spraycan::Config",
        name: "background_file_guid",
        value: 0
      });

      Backbone.sync('create', prefs, {
        success: function(model, resp) {
          Spraycan.reload_styles();
          Spraycan.rollback.preferences.background_file_guid = Spraycan.preferences.background_file_guid;
          Spraycan.preferences.background_file_guid = 0;

          Spraycan.rollback.preferences.background_file_url = Spraycan.preferences.background_file_url;
          Spraycan.preferences.background_file_url = "";
        },
        error: Spraycan.handle_save_error
      });
    });

    // handle actual backgroun upload
    $('#background_file').change(function() {

      $('#section-images-background .ready').removeClass('visible').addClass('hidden');
      $('#section-images-background .uploading').removeClass('hidden').addClass('visible');

      $(this).upload('/spraycan/themes/' + Spraycan.theme_id + '/files.js', { 'preference': 'background_file_guid' }, function(res) {
        $('#section-images-background .uploading').removeClass('visible').addClass('hidden')

        if(res.id!="false"){
          Spraycan.reload_styles();

          Spraycan.rollback.preferences.background_file_guid = Spraycan.preferences.background_file_guid;
          Spraycan.preferences.background_file_guid = res.guid;
          Spraycan.rollback.preferences.background_file_url = Spraycan.preferences.background_file_url;
          Spraycan.preferences.background_file_url = res.url;

          $('#section-images-background .edit').removeClass('hidden').addClass('visible');
          $('#section-images-background .images-upload-background').css('background-image', 'url(' + Spraycan.preferences.background_file_url + ')');
        }
      }, 'json');
    });


    //display logo if value already set:
    if(Spraycan.preferences.background_file_url!=''){
      $('#section-images-background .ready').removeClass('visible').addClass('hidden');
      $('#section-images-background .edit').removeClass('hidden').addClass('visible');
      $('#section-images-background .images-upload-background').css('background-image', 'url(' + Spraycan.preferences.background_file_url + ')');
    }

    //background repeat inputs
    var bg_repeat_inputs = $("#section-images-background .repeat .values");
    var bg_repeat = bg_repeat_inputs.find('input:checked').attr("id").split('images-bg-')[1];

    $("#section-images-background .images-upload-background").css({
      backgroundRepeat: bg_repeat
    });

    bg_repeat_inputs.find('input').each(function(){
      $(this).change(function(){
        if($(this).attr("checked") == "checked"){
          var bg_repeat = $(this).attr("id").split('images-bg-')[1]
          $("#section-images-background .images-upload-background").css({
            backgroundRepeat: bg_repeat
          });

          //submit perference to server
          prefs = new Spraycan.Collections.Preferences();
          prefs.add({
            configuration: "Spraycan::Config",
            name: "background_repeat",
            value: bg_repeat
          });

          Backbone.sync('create', prefs, {
            success: function(model, resp) {
              Spraycan.reload_styles();
              Spraycan.rollback.preferences.logo_alignment = Spraycan.preferences.background_repeat;
              Spraycan.preferences.background_repeat = bg_repeat;
            },
            error: Spraycan.handle_save_error
          });

        }
      })
    });

    //background align inputs
    var bg_align_inputs = $("#section-images-background .align .values");
    var bg_align = bg_align_inputs.find('input:checked').attr("id").split('images-bg-align-')[1].split('-')[0] + " " + bg_align_inputs.find('input:checked').attr("id").split('images-bg-align-')[1].split('-')[1];

    $("#section-images-background .images-upload-background").css({
      backgroundPosition: bg_align
    });

    bg_align_inputs.find('input').each(function(){
      $(this).change(function(){
        if($(this).attr("checked") == "checked"){
          var bg_align = $(this).attr("id").split('images-bg-align-')[1].split('-')[0] + " " + $(this).attr("id").split('images-bg-align-')[1].split('-')[1];
          $("#section-images-background .images-upload-background").css({
            backgroundPosition: bg_align
          });

          //submit perference to server
          prefs = new Spraycan.Collections.Preferences();
          prefs.add({
            configuration: "Spraycan::Config",
            name: "background_alignment",
            value: bg_align
          });

          Backbone.sync('create', prefs, {
            success: function(model, resp) {
              Spraycan.reload_styles();
              Spraycan.rollback.preferences.logo_alignment = Spraycan.preferences.background_alignment;
              Spraycan.preferences.background_alignment = bg_align;
            },
            error: Spraycan.handle_save_error
          });
        }
      })
    });


  },

  save: function(event){
    if(event!=undefined){
      event.preventDefault();
    }
    // Spraycan.clear_errors();

    attrs = $('form#images_form').serializeObject();

    prefs = new Spraycan.Collections.Preferences();

    _.each(attrs, function(value, key){
      prefs.add({
        configuration: "Spraycan::Config",
        name: key,
        value: value
      });
    });

    Backbone.sync('create', prefs, {
      success: function(model, resp) {
        Spraycan.reload_frame();
      },
      error: Spraycan.handle_save_error
    });


    return false;
   }

});

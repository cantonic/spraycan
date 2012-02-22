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

    $("#spreeworks-editor .tabs .active").removeClass('active');
    $("#spreeworks-editor .tabs .images").addClass('active');

    $("#spreeworks-editor .content")
      .removeClass('active-layouts active-colors active-fonts active-images')
      .addClass('active-images')
      .find(".tab.active")
      .hide()
      .removeClass('active');

    $("#spreeworks-editor .content")
      .show()
      .find(".tab#tab-images")
      .show()
      .addClass('active');


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
    $('div#favicon_uploader, #section-images-favicon .actions .edit ').click(function(){
      $('#favicon_file').trigger('click');
    });

    // handle actual favicon upload
    $('#favicon_file').change(function() {

      $('#section-images-favicon .ready').removeClass('visible').addClass('hidden');
      $('#section-images-favicon .uploading').removeClass('hidden').addClass('visible');

      $(this).upload('/spraycan/themes/' + Spraycan.theme_id + '/files.js', { 'preference': 'favicon_file_name' }, function(res) {
        $('#section-images-favicon .uploading').removeClass('visible').addClass('hidden')

        if(res!="false"){
          eval(res);
          Spraycan.rollback.preferences.favicon_file_name = Spraycan.preferences.favicon_file_name;
          Spraycan.preferences.favicon_file_name = filename;

          $('#section-images-favicon .edit').removeClass('hidden').addClass('visible');
          $('#section-images-favicon .images-upload-background').css('background-image', 'url(' + Spraycan.preferences.favicon_file_name + ')');
        }
      }, 'script');
    });

    //display favicon if value already set:
    if(Spraycan.preferences.favicon_file_name!=''){
      $('#section-images-favicon .ready').removeClass('visible').addClass('hidden');
      $('#section-images-favicon .edit').removeClass('hidden').addClass('visible');
      $('#section-images-favicon .images-upload-background').css('background-image', 'url(' + Spraycan.preferences.favicon_file_name + ')');
    }


    //--------------- LOGO ----------------//
    // wire upload for click
    $('div#logo_uploader, #section-images-logo .actions .edit ').click(function(){
      $('#logo_file').trigger('click');
    });

    // handle actual favicon upload
    $('#logo_file').change(function() {

      $('#section-images-logo .ready').removeClass('visible').addClass('hidden');
      $('#section-images-logo .uploading').removeClass('hidden').addClass('visible');

      $(this).upload('/spraycan/themes/' + Spraycan.theme_id + '/files.js', { 'preference': 'logo_file_name' }, function(res) {
        $('#section-images-logo .uploading').removeClass('visible').addClass('hidden')

        if(res!="false"){
          eval(res);
          Spraycan.rollback.preferences.logo_file_name = Spraycan.preferences.logo_file_name;
          Spraycan.preferences.logo_file_name = filename;

          $('#section-images-logo .edit').removeClass('hidden').addClass('visible');
          $('#section-images-logo .images-upload-background').css('background-image', 'url(' + Spraycan.preferences.logo_file_name + ')');
        }
      }, 'script');
    });


    //display logo if value already set:
    if(Spraycan.preferences.logo_file_name!=''){
      $('#section-images-logo .ready').removeClass('visible').addClass('hidden');
      $('#section-images-logo .edit').removeClass('hidden').addClass('visible');
      $('#section-images-logo .images-upload-background').css('background-image', 'url(' + Spraycan.preferences.logo_file_name + ')');
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
    $('div#background_uploader, #section-images-background .actions .edit ').click(function(){
      $('#background_file').trigger('click');
    });

    // handle actual favicon upload
    $('#background_file').change(function() {

      $('#section-images-background .ready').removeClass('visible').addClass('hidden');
      $('#section-images-background .uploading').removeClass('hidden').addClass('visible');

      $(this).upload('/spraycan/themes/' + Spraycan.theme_id + '/files.js', { 'preference': 'background_file_name' }, function(res) {
        $('#section-images-background .uploading').removeClass('visible').addClass('hidden')

        if(res!="false"){
          eval(res);
          Spraycan.rollback.preferences.background_file_name = Spraycan.preferences.background_file_name;
          Spraycan.preferences.background_file_name = filename;

          $('#section-images-background .edit').removeClass('hidden').addClass('visible');
          $('#section-images-background .images-upload-background').css('background-image', 'url(' + Spraycan.preferences.background_file_name + ')');
        }
      }, 'script');
    });


    //display logo if value already set:
    if(Spraycan.preferences.background_file_name!=''){
      $('#section-images-background .ready').removeClass('visible').addClass('hidden');
      $('#section-images-background .edit').removeClass('hidden').addClass('visible');
      $('#section-images-background .images-upload-background').css('background-image', 'url(' + Spraycan.preferences.background_file_name + ')');
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
    event.preventDefault();
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
        Spraycan.rollback.preferences.logo_file_name = null;
        Spraycan.rollback.preferences.background_file_name = null;
        Spraycan.reload_frame();
      },
      error: Spraycan.handle_save_error
    });

 
    return false;
   }

});


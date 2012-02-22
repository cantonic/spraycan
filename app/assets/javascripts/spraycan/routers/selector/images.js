Spraycan.Routers.Images = Backbone.Router.extend({
  routes: {
    "tab-images": "edit",
  },

  edit: function(){
    new Spraycan.Views.Images.Edit();
  }
});

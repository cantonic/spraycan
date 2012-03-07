module Spraycan
  class BootController < Spraycan::BaseController
    before_filter :load_objects, :only => [:state]

    def editor
      #editor boot method
      if Theme.active.empty?
        if Theme.all.empty?
          Theme.create(:name => "Site Theme", :active => true)
        else
          Theme.first.update_attribute(:active, true)
        end
      end

      if session[:full]
        render :action => "editor", :layout => false
      else
        load_objects

        render :action => "selector", :layout => false
      end
    end

    def toggle
      session[:full] = !session[:full]
      redirect_to '/spraycan#'
    end


    private
      def load_objects
        @themes = Theme.all
        @palettes = Palette.all
        @packs = Pack.all
      end

  end
end

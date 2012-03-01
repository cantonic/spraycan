module Spraycan
  class BootController < Spraycan::BaseController

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
        @themes = Theme.all
        @palettes = Palette.all

        render :action => "selector", :layout => false
      end
    end

    def toggle
      session[:full] = !session[:full]
      redirect_to '/spraycan#'
    end

  end
end

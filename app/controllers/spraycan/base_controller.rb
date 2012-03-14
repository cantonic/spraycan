class Spraycan::BaseController < ActionController::Base
  before_filter :authenticate_spraycan

  private
    def authenticate_spraycan
      # unless Rails.env.development?
      #   raise ActionController::RoutingError.new('Spraycan is only enabled in development mode by default.')
      #   return false
      # end
    end

   def invalidate_cached_view_overrides
     Rails.cache.delete 'spraycan_all_view_overrides'
   end
end

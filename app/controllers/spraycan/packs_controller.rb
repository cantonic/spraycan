module Spraycan
  class PacksController < Spraycan::BaseController
    after_filter :invalidate_cached_view_overrides, :only => [:create, :update, :destroy]
    respond_to :json

    def index
      @packs = Pack.all
      respond_with @packs
    end

    def create
      import = params[:pack].delete :import

      @pack = Pack.create params[:pack]
      @pack.active = true

      if import 
        @pack.update_from_running
      end

      respond_with @pack
    end

    def update
      import = params[:pack].delete :import

      @pack = Pack.where(:id => params.delete(:id)).first
      @pack.update_attributes params[:pack]

      if import 
        @pack.update_from_running
      end

      respond_with @pack
    end

    def destroy
      render :json => Pack.destroy(params[:id])
    end
  end
end

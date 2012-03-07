class Spraycan::ThemesController < Spraycan::BaseController
  # after_filter :initialize_themes, :only => [:create, :update, :destroy]

  respond_to :json

  def index
    @themes = Spraycan::Theme.all

    respond_with @themes
  end

  def create
    @theme = Spraycan::Theme.create params[:theme]

    respond_with @theme
  end

  def update
    @theme = Spraycan::Theme.where(:id => params.delete(:id)).first
    @theme.insert_at params[:theme][:position] if params[:theme].key? :position
    @theme.update_attributes params[:theme]

    respond_with @theme
  end

  def destroy
    render :js => Spraycan::Theme.destroy(params[:id]).to_s
  end

  def export
    @theme = Spraycan::Theme.find(params[:id])

    dump_path = File.join([Rails.root, "public", "#{@theme.guid}.json"])
    File.open(dump_path, 'w') {|f| f.write(@theme.export) }

    #redirect_to "/downloads/#{self.id}.json"
    send_file dump_path, :type => 'application/json'
  end

  def import
    file_path = Rails.root.join('tmp', params[:qqfile]).to_s
    File.open(file_path, 'wb'){|f| f.write request.raw_post }

    if Spraycan::Theme.import_from_string(File.open(file_path).read)
      render :json => {:success => 'true'}
    else
      render :json => {:error => 'Failed to create file'}
    end
  end

end

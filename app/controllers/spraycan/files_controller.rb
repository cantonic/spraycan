class Spraycan::FilesController < Spraycan::BaseController
  respond_to :json

  before_filter :set_theme, :only => [:index, :create]

  def index
    @files = @theme.files

    respond_with @files
  end


  #sets id to preference passed and returns url

  def create
    if @file = Spraycan::File.where(:name => params[:file][:file].original_filename).first
      @file.destroy
      @file = @theme.files.create params[:file]
    else
      @file = @theme.files.create params[:file]
    end

    if !@file.new_record?
      if params.key? :preference
        Spraycan::Config.send "#{params[:preference]}=", @file.id
      end

      render :json => {:id => @file.id, :url => @file.url }.to_json
    else
      render :json => {:id => false }.to_json
    end
  end

  def update
    @file = Spraycan::File.where(:id => params.delete(:id)).first
    @file.update_attributes params[:file]

    respond_with @file
  end

  def destroy
    render :js => Spraycan::File.destroy(params[:id])
  end

  private
    def set_theme
      @theme = Spraycan::Theme.find(params[:theme_id])
    end

end


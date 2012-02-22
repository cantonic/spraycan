class Spraycan::FilesController < Spraycan::BaseController
  respond_to :js

  before_filter :set_theme, :only => [:index, :create]

  def index
    @files = @theme.files

    respond_with @files
  end

  def create
    @file = @theme.files.create params[:file]

    if !@file.new_record?
      if params.key? :preference
        Spraycan::Config.send "#{params[:preference]}=", @file.file.to_s
      end
      render :js => "var filename = '#{@file.file.to_s}'";
    else
      render :js => "false"
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


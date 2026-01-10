class ApplicationController < ActionController::API
  def authorize_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    
    begin
      @decoded = JsonWebToken.decode(header)
      
      # Adicionamos uma verificação aqui:
      if @decoded.present?
        @current_user = Admin.find(@decoded[:user_id])
      else
        render json: { errors: 'Token inválido ou ausente' }, status: :unauthorized
      end

    rescue ActiveRecord::RecordNotFound => e
      render json: { errors: 'Usuário não encontrado' }, status: :unauthorized
    rescue JWT::DecodeError => e
      render json: { errors: e.message }, status: :unauthorized
    end
  end
end

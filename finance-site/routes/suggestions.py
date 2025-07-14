from flask import Blueprint, jsonify, request
from src.models.suggestions import StockSuggestion, db

suggestions_bp = Blueprint('suggestions', __name__)

@suggestions_bp.route('/suggestions', methods=['GET'])
def get_suggestions():
    """Obtém todas as sugestões de ações com filtros opcionais."""
    try:
        # Parâmetros de filtro
        investment_type = request.args.get('investment_type')
        risk_profile = request.args.get('risk_profile')
        active_only = request.args.get('active_only', 'true').lower() == 'true'
        limit = request.args.get('limit', 20, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Query base
        query = StockSuggestion.query
        
        # Filtrar apenas sugestões ativas por padrão
        if active_only:
            query = query.filter(StockSuggestion.is_active == True)
        
        # Aplicar filtros
        if investment_type:
            query = query.filter(StockSuggestion.investment_type.ilike(f'%{investment_type}%'))
        
        if risk_profile:
            query = query.filter(StockSuggestion.risk_profile.ilike(f'%{risk_profile}%'))
        
        # Ordenação por data de criação (mais recentes primeiro)
        query = query.order_by(StockSuggestion.created_at.desc())
        
        # Paginação
        query = query.offset(offset).limit(limit)
        
        suggestions = query.all()
        
        return jsonify({
            'success': True,
            'data': [suggestion.to_dict() for suggestion in suggestions],
            'count': len(suggestions),
            'disclaimer': 'IMPORTANTE: As sugestões apresentadas são apenas para fins informativos e educacionais. Elas não constituem aconselhamento financeiro, recomendação de investimento ou oferta de compra/venda de quaisquer títulos. O investimento em mercados financeiros envolve riscos, incluindo a possível perda do capital investido. Você é inteiramente responsável por suas próprias decisões de investimento e deve buscar aconselhamento de um profissional financeiro qualificado antes de tomar qualquer decisão de investimento.'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@suggestions_bp.route('/suggestions/<int:suggestion_id>', methods=['GET'])
def get_suggestion_by_id(suggestion_id):
    """Obtém uma sugestão específica pelo ID."""
    try:
        suggestion = StockSuggestion.query.get(suggestion_id)
        if not suggestion:
            return jsonify({
                'success': False,
                'error': 'Sugestão não encontrada'
            }), 404
        
        return jsonify({
            'success': True,
            'data': suggestion.to_dict(),
            'disclaimer': 'IMPORTANTE: As sugestões apresentadas são apenas para fins informativos e educacionais. Elas não constituem aconselhamento financeiro, recomendação de investimento ou oferta de compra/venda de quaisquer títulos. O investimento em mercados financeiros envolve riscos, incluindo a possível perda do capital investido. Você é inteiramente responsável por suas próprias decisões de investimento e deve buscar aconselhamento de um profissional financeiro qualificado antes de tomar qualquer decisão de investimento.'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@suggestions_bp.route('/suggestions/types', methods=['GET'])
def get_investment_types():
    """Obtém todos os tipos de investimento disponíveis."""
    try:
        types = db.session.query(StockSuggestion.investment_type).distinct().all()
        types_list = [type_[0] for type_ in types if type_[0]]
        
        return jsonify({
            'success': True,
            'data': types_list,
            'count': len(types_list)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@suggestions_bp.route('/suggestions/risk-profiles', methods=['GET'])
def get_risk_profiles():
    """Obtém todos os perfis de risco disponíveis."""
    try:
        profiles = db.session.query(StockSuggestion.risk_profile).distinct().all()
        profiles_list = [profile[0] for profile in profiles if profile[0]]
        
        return jsonify({
            'success': True,
            'data': profiles_list,
            'count': len(profiles_list)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@suggestions_bp.route('/suggestions/by-symbol/<symbol>', methods=['GET'])
def get_suggestions_by_symbol(symbol):
    """Obtém sugestões para um símbolo específico."""
    try:
        suggestions = StockSuggestion.query.filter_by(
            symbol=symbol.upper(),
            is_active=True
        ).order_by(StockSuggestion.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'data': [suggestion.to_dict() for suggestion in suggestions],
            'count': len(suggestions),
            'disclaimer': 'IMPORTANTE: As sugestões apresentadas são apenas para fins informativos e educacionais. Elas não constituem aconselhamento financeiro, recomendação de investimento ou oferta de compra/venda de quaisquer títulos. O investimento em mercados financeiros envolve riscos, incluindo a possível perda do capital investido. Você é inteiramente responsável por suas próprias decisões de investimento e deve buscar aconselhamento de um profissional financeiro qualificado antes de tomar qualquer decisão de investimento.'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


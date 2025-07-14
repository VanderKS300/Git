from flask import Blueprint, jsonify, request
from src.models.news import ExpertNews, db

news_bp = Blueprint('news', __name__)

@news_bp.route('/news', methods=['GET'])
def get_news():
    """Obtém todas as notícias com filtros opcionais."""
    try:
        # Parâmetros de filtro
        category = request.args.get('category')
        expert = request.args.get('expert')
        limit = request.args.get('limit', 20, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Query base
        query = ExpertNews.query
        
        # Aplicar filtros
        if category:
            query = query.filter(ExpertNews.category.ilike(f'%{category}%'))
        
        if expert:
            query = query.filter(ExpertNews.expert_name.ilike(f'%{expert}%'))
        
        # Ordenação por data de publicação (mais recentes primeiro)
        query = query.order_by(ExpertNews.publish_date.desc())
        
        # Paginação
        query = query.offset(offset).limit(limit)
        
        news = query.all()
        
        return jsonify({
            'success': True,
            'data': [article.to_dict() for article in news],
            'count': len(news)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@news_bp.route('/news/<int:news_id>', methods=['GET'])
def get_news_by_id(news_id):
    """Obtém uma notícia específica pelo ID."""
    try:
        news = ExpertNews.query.get(news_id)
        if not news:
            return jsonify({
                'success': False,
                'error': 'Notícia não encontrada'
            }), 404
        
        return jsonify({
            'success': True,
            'data': news.to_dict()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@news_bp.route('/news/categories', methods=['GET'])
def get_news_categories():
    """Obtém todas as categorias de notícias disponíveis."""
    try:
        categories = db.session.query(ExpertNews.category).distinct().all()
        categories_list = [cat[0] for cat in categories if cat[0]]
        
        return jsonify({
            'success': True,
            'data': categories_list,
            'count': len(categories_list)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@news_bp.route('/news/experts', methods=['GET'])
def get_experts():
    """Obtém todos os especialistas disponíveis."""
    try:
        experts = db.session.query(ExpertNews.expert_name).distinct().all()
        experts_list = [expert[0] for expert in experts if expert[0]]
        
        return jsonify({
            'success': True,
            'data': experts_list,
            'count': len(experts_list)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@news_bp.route('/news/search', methods=['GET'])
def search_news():
    """Busca notícias por título ou conteúdo."""
    try:
        query_param = request.args.get('q', '')
        limit = request.args.get('limit', 20, type=int)
        
        if not query_param:
            return jsonify({
                'success': False,
                'error': 'Parâmetro de busca é obrigatório'
            }), 400
        
        news = ExpertNews.query.filter(
            db.or_(
                ExpertNews.title.ilike(f'%{query_param}%'),
                ExpertNews.summary.ilike(f'%{query_param}%')
            )
        ).order_by(ExpertNews.publish_date.desc()).limit(limit).all()
        
        return jsonify({
            'success': True,
            'data': [article.to_dict() for article in news],
            'count': len(news)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


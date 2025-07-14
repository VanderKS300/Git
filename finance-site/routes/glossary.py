from flask import Blueprint, jsonify, request
from src.models.glossary import FinancialTerm, db

glossary_bp = Blueprint('glossary', __name__)

@glossary_bp.route('/glossary', methods=['GET'])
def get_terms():
    """Obtém todos os termos do glossário com filtros opcionais."""
    try:
        # Parâmetros de filtro
        category = request.args.get('category')
        letter = request.args.get('letter')
        limit = request.args.get('limit', 50, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Query base
        query = FinancialTerm.query
        
        # Aplicar filtros
        if category:
            query = query.filter(FinancialTerm.category.ilike(f'%{category}%'))
        
        if letter:
            query = query.filter(FinancialTerm.term.ilike(f'{letter}%'))
        
        # Ordenação alfabética
        query = query.order_by(FinancialTerm.term.asc())
        
        # Paginação
        query = query.offset(offset).limit(limit)
        
        terms = query.all()
        
        return jsonify({
            'success': True,
            'data': [term.to_dict() for term in terms],
            'count': len(terms)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@glossary_bp.route('/glossary/<int:term_id>', methods=['GET'])
def get_term_by_id(term_id):
    """Obtém um termo específico pelo ID."""
    try:
        term = FinancialTerm.query.get(term_id)
        if not term:
            return jsonify({
                'success': False,
                'error': 'Termo não encontrado'
            }), 404
        
        return jsonify({
            'success': True,
            'data': term.to_dict()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@glossary_bp.route('/glossary/term/<term_name>', methods=['GET'])
def get_term_by_name(term_name):
    """Obtém um termo específico pelo nome."""
    try:
        term = FinancialTerm.query.filter_by(term=term_name).first()
        if not term:
            return jsonify({
                'success': False,
                'error': 'Termo não encontrado'
            }), 404
        
        return jsonify({
            'success': True,
            'data': term.to_dict()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@glossary_bp.route('/glossary/categories', methods=['GET'])
def get_categories():
    """Obtém todas as categorias de termos disponíveis."""
    try:
        categories = db.session.query(FinancialTerm.category).distinct().all()
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

@glossary_bp.route('/glossary/letters', methods=['GET'])
def get_letters():
    """Obtém todas as letras iniciais dos termos disponíveis."""
    try:
        # Busca as primeiras letras dos termos
        letters_query = db.session.query(
            db.func.upper(db.func.substr(FinancialTerm.term, 1, 1)).label('letter')
        ).distinct().all()
        
        letters_list = sorted([letter[0] for letter in letters_query if letter[0]])
        
        return jsonify({
            'success': True,
            'data': letters_list,
            'count': len(letters_list)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@glossary_bp.route('/glossary/search', methods=['GET'])
def search_terms():
    """Busca termos por nome ou definição."""
    try:
        query_param = request.args.get('q', '')
        limit = request.args.get('limit', 20, type=int)
        
        if not query_param:
            return jsonify({
                'success': False,
                'error': 'Parâmetro de busca é obrigatório'
            }), 400
        
        terms = FinancialTerm.query.filter(
            db.or_(
                FinancialTerm.term.ilike(f'%{query_param}%'),
                FinancialTerm.definition.ilike(f'%{query_param}%')
            )
        ).order_by(FinancialTerm.term.asc()).limit(limit).all()
        
        return jsonify({
            'success': True,
            'data': [term.to_dict() for term in terms],
            'count': len(terms)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


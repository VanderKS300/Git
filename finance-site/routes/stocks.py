from flask import Blueprint, jsonify, request
from src.models.stock import Stock, db

stocks_bp = Blueprint('stocks', __name__)

@stocks_bp.route('/stocks', methods=['GET'])
def get_stocks():
    """Obtém todas as ações com filtros opcionais."""
    try:
        # Parâmetros de filtro
        symbol = request.args.get('symbol')
        sector = request.args.get('sector')
        sort_by = request.args.get('sort_by', 'symbol')
        order = request.args.get('order', 'asc')
        limit = request.args.get('limit', type=int)
        
        # Query base
        query = Stock.query
        
        # Aplicar filtros
        if symbol:
            query = query.filter(Stock.symbol.ilike(f'%{symbol}%'))
        
        # Ordenação
        if hasattr(Stock, sort_by):
            column = getattr(Stock, sort_by)
            if order.lower() == 'desc':
                query = query.order_by(column.desc())
            else:
                query = query.order_by(column.asc())
        
        # Limite
        if limit:
            query = query.limit(limit)
        
        stocks = query.all()
        return jsonify({
            'success': True,
            'data': [stock.to_dict() for stock in stocks],
            'count': len(stocks)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@stocks_bp.route('/stocks/<symbol>', methods=['GET'])
def get_stock_by_symbol(symbol):
    """Obtém uma ação específica pelo símbolo."""
    try:
        stock = Stock.query.filter_by(symbol=symbol.upper()).first()
        if not stock:
            return jsonify({
                'success': False,
                'error': 'Ação não encontrada'
            }), 404
        
        return jsonify({
            'success': True,
            'data': stock.to_dict()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@stocks_bp.route('/stocks/top-gainers', methods=['GET'])
def get_top_gainers():
    """Obtém as ações com maiores altas do dia."""
    try:
        limit = request.args.get('limit', 10, type=int)
        
        stocks = Stock.query.filter(
            Stock.regular_market_change_percent.isnot(None)
        ).order_by(
            Stock.regular_market_change_percent.desc()
        ).limit(limit).all()
        
        return jsonify({
            'success': True,
            'data': [stock.to_dict() for stock in stocks],
            'count': len(stocks)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@stocks_bp.route('/stocks/top-losers', methods=['GET'])
def get_top_losers():
    """Obtém as ações com maiores baixas do dia."""
    try:
        limit = request.args.get('limit', 10, type=int)
        
        stocks = Stock.query.filter(
            Stock.regular_market_change_percent.isnot(None)
        ).order_by(
            Stock.regular_market_change_percent.asc()
        ).limit(limit).all()
        
        return jsonify({
            'success': True,
            'data': [stock.to_dict() for stock in stocks],
            'count': len(stocks)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@stocks_bp.route('/stocks/search', methods=['GET'])
def search_stocks():
    """Busca ações por nome ou símbolo."""
    try:
        query_param = request.args.get('q', '')
        limit = request.args.get('limit', 20, type=int)
        
        if not query_param:
            return jsonify({
                'success': False,
                'error': 'Parâmetro de busca é obrigatório'
            }), 400
        
        stocks = Stock.query.filter(
            db.or_(
                Stock.symbol.ilike(f'%{query_param}%'),
                Stock.short_name.ilike(f'%{query_param}%'),
                Stock.long_name.ilike(f'%{query_param}%')
            )
        ).limit(limit).all()
        
        return jsonify({
            'success': True,
            'data': [stock.to_dict() for stock in stocks],
            'count': len(stocks)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


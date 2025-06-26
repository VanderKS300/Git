from flask import Blueprint, request, jsonify, session
from src.models.user import db, User
from src.models.condominium import Condominium, Resident, Boleto, Occurrence, Announcement
from datetime import datetime, date

condominium_bp = Blueprint('condominium', __name__)

# Rotas públicas (para visitantes)
@condominium_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    """Retorna dados do dashboard para visitantes"""
    try:
        total_condominiums = Condominium.query.count()
        total_residents = Resident.query.count()
        total_boletos = Boleto.query.count()
        total_occurrences = Occurrence.query.count()
        
        return jsonify({
            'total_condominiums': total_condominiums,
            'total_residents': total_residents,
            'total_boletos': total_boletos,
            'total_occurrences': total_occurrences
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@condominium_bp.route('/condominiums', methods=['GET'])
def get_condominiums():
    """Retorna lista de condomínios para visitantes"""
    try:
        condominiums = Condominium.query.all()
        return jsonify([c.to_dict() for c in condominiums])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@condominium_bp.route('/boletos/recent', methods=['GET'])
def get_recent_boletos():
    """Retorna boletos recentes para visitantes"""
    try:
        boletos = Boleto.query.order_by(Boleto.data_vencimento.desc()).limit(10).all()
        return jsonify([b.to_dict() for b in boletos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@condominium_bp.route('/announcements', methods=['GET'])
def get_announcements():
    """Retorna comunicados para visitantes"""
    try:
        announcements = Announcement.query.order_by(Announcement.data_publicacao.desc()).limit(5).all()
        return jsonify([a.to_dict() for a in announcements])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rotas de autenticação
@condominium_bp.route('/login', methods=['POST'])
def login():
    """Login do administrador"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username e password são obrigatórios'}), 400
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            session['user_id'] = user.id
            session['username'] = user.username
            return jsonify({'message': 'Login realizado com sucesso', 'user': user.to_dict()})
        else:
            return jsonify({'error': 'Credenciais inválidas'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@condominium_bp.route('/logout', methods=['POST'])
def logout():
    """Logout do administrador"""
    session.clear()
    return jsonify({'message': 'Logout realizado com sucesso'})

@condominium_bp.route('/check-auth', methods=['GET'])
def check_auth():
    """Verifica se o usuário está autenticado"""
    if 'user_id' in session:
        return jsonify({'authenticated': True, 'username': session.get('username')})
    else:
        return jsonify({'authenticated': False})

# Decorator para verificar autenticação
def login_required(f):
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Acesso negado. Login necessário.'}), 401
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

# Rotas administrativas (requerem autenticação)
@condominium_bp.route('/admin/condominiums', methods=['POST'])
@login_required
def create_condominium():
    """Criar novo condomínio (admin)"""
    try:
        data = request.get_json()
        condominium = Condominium(
            nome=data['nome'],
            endereco=data['endereco']
        )
        db.session.add(condominium)
        db.session.commit()
        return jsonify(condominium.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@condominium_bp.route('/admin/residents', methods=['POST'])
@login_required
def create_resident():
    """Criar novo morador (admin)"""
    try:
        data = request.get_json()
        resident = Resident(
            nome=data['nome'],
            unidade=data['unidade'],
            email=data.get('email'),
            telefone=data.get('telefone'),
            condominium_id=data['condominium_id']
        )
        db.session.add(resident)
        db.session.commit()
        return jsonify(resident.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@condominium_bp.route('/admin/boletos', methods=['POST'])
@login_required
def create_boleto():
    """Criar novo boleto (admin)"""
    try:
        data = request.get_json()
        boleto = Boleto(
            descricao=data['descricao'],
            valor=float(data['valor']),
            data_vencimento=datetime.strptime(data['data_vencimento'], '%Y-%m-%d').date(),
            status=data.get('status', 'Pendente'),
            resident_id=data['resident_id']
        )
        db.session.add(boleto)
        db.session.commit()
        return jsonify(boleto.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@condominium_bp.route('/admin/announcements', methods=['POST'])
@login_required
def create_announcement():
    """Criar novo comunicado (admin)"""
    try:
        data = request.get_json()
        announcement = Announcement(
            titulo=data['titulo'],
            conteudo=data['conteudo']
        )
        db.session.add(announcement)
        db.session.commit()
        return jsonify(announcement.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@condominium_bp.route('/admin/occurrences', methods=['POST'])
@login_required
def create_occurrence():
    """Criar nova ocorrência (admin)"""
    try:
        data = request.get_json()
        occurrence = Occurrence(
            titulo=data['titulo'],
            descricao=data.get('descricao'),
            condominium_id=data['condominium_id'],
            resident_id=data.get('resident_id')
        )
        db.session.add(occurrence)
        db.session.commit()
        return jsonify(occurrence.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


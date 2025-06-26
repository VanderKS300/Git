from src.models.user import db
from datetime import datetime

class Condominium(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    endereco = db.Column(db.String(200), nullable=False)
    
    # Relacionamentos
    moradores = db.relationship('Resident', backref='condominium', lazy=True)
    ocorrencias = db.relationship('Occurrence', backref='condominium', lazy=True)
    
    def __repr__(self):
        return f'<Condominium {self.nome}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'endereco': self.endereco,
            'total_moradores': len(self.moradores),
            'total_ocorrencias': len(self.ocorrencias)
        }

class Resident(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    unidade = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    telefone = db.Column(db.String(20), nullable=True)
    condominium_id = db.Column(db.Integer, db.ForeignKey('condominium.id'), nullable=False)
    
    # Relacionamentos
    boletos = db.relationship('Boleto', backref='resident', lazy=True)
    
    def __repr__(self):
        return f'<Resident {self.nome}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'unidade': self.unidade,
            'email': self.email,
            'telefone': self.telefone,
            'condominium_id': self.condominium_id
        }

class Boleto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String(200), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    data_vencimento = db.Column(db.Date, nullable=False)
    data_pagamento = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(20), nullable=False, default='Pendente')
    resident_id = db.Column(db.Integer, db.ForeignKey('resident.id'), nullable=False)
    
    def __repr__(self):
        return f'<Boleto {self.descricao} - {self.valor}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'descricao': self.descricao,
            'valor': self.valor,
            'data_vencimento': self.data_vencimento.isoformat() if self.data_vencimento else None,
            'data_pagamento': self.data_pagamento.isoformat() if self.data_pagamento else None,
            'status': self.status,
            'resident_id': self.resident_id,
            'morador_nome': self.resident.nome if self.resident else None
        }

class Occurrence(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    data_registro = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    status = db.Column(db.String(20), nullable=False, default='Aberta')
    condominium_id = db.Column(db.Integer, db.ForeignKey('condominium.id'), nullable=False)
    resident_id = db.Column(db.Integer, db.ForeignKey('resident.id'), nullable=True)
    
    def __repr__(self):
        return f'<Occurrence {self.titulo}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'data_registro': self.data_registro.isoformat() if self.data_registro else None,
            'status': self.status,
            'condominium_id': self.condominium_id,
            'resident_id': self.resident_id
        }

class Announcement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    conteudo = db.Column(db.Text, nullable=False)
    data_publicacao = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Announcement {self.titulo}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'conteudo': self.conteudo,
            'data_publicacao': self.data_publicacao.isoformat() if self.data_publicacao else None
        }


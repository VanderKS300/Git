from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class StockSuggestion(db.Model):
    __tablename__ = 'stock_suggestions'
    
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10), nullable=False)
    justification = db.Column(db.Text, nullable=False)
    investment_type = db.Column(db.String(50))  # curto, médio, longo prazo
    risk_profile = db.Column(db.String(50))     # conservador, moderado, arrojado
    target_price = db.Column(db.Float)
    analyst_name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'symbol': self.symbol,
            'justification': self.justification,
            'investmentType': self.investment_type,
            'riskProfile': self.risk_profile,
            'targetPrice': self.target_price,
            'analystName': self.analyst_name,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'isActive': self.is_active
        }


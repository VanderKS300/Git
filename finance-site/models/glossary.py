from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class FinancialTerm(db.Model):
    __tablename__ = 'financial_terms'
    
    id = db.Column(db.Integer, primary_key=True)
    term = db.Column(db.String(100), unique=True, nullable=False)
    definition = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50))
    examples = db.Column(db.Text)
    related_terms = db.Column(db.Text)  # JSON string com termos relacionados
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'term': self.term,
            'definition': self.definition,
            'category': self.category,
            'examples': self.examples,
            'relatedTerms': self.related_terms,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }


from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class ExpertNews(db.Model):
    __tablename__ = 'expert_news'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    summary = db.Column(db.Text)
    source = db.Column(db.String(100))
    publish_date = db.Column(db.DateTime)
    expert_name = db.Column(db.String(100))
    article_url = db.Column(db.String(300))
    category = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'summary': self.summary,
            'source': self.source,
            'publishDate': self.publish_date.isoformat() if self.publish_date else None,
            'expertName': self.expert_name,
            'articleUrl': self.article_url,
            'category': self.category,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }


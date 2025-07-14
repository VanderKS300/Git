from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Stock(db.Model):
    __tablename__ = 'stocks'
    
    symbol = db.Column(db.String(10), primary_key=True)
    short_name = db.Column(db.String(100))
    long_name = db.Column(db.String(200))
    currency = db.Column(db.String(10))
    regular_market_price = db.Column(db.Float)
    regular_market_day_high = db.Column(db.Float)
    regular_market_day_low = db.Column(db.Float)
    regular_market_change = db.Column(db.Float)
    regular_market_change_percent = db.Column(db.Float)
    regular_market_time = db.Column(db.String(50))
    market_cap = db.Column(db.BigInteger)
    regular_market_volume = db.Column(db.BigInteger)
    logo_url = db.Column(db.String(200))
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'symbol': self.symbol,
            'shortName': self.short_name,
            'longName': self.long_name,
            'currency': self.currency,
            'regularMarketPrice': self.regular_market_price,
            'regularMarketDayHigh': self.regular_market_day_high,
            'regularMarketDayLow': self.regular_market_day_low,
            'regularMarketChange': self.regular_market_change,
            'regularMarketChangePercent': self.regular_market_change_percent,
            'regularMarketTime': self.regular_market_time,
            'marketCap': self.market_cap,
            'regularMarketVolume': self.regular_market_volume,
            'logoUrl': self.logo_url,
            'lastUpdated': self.last_updated.isoformat() if self.last_updated else None
        }


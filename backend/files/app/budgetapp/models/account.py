from budgetapp.extensions import db

class Account(db.Model):
    __tablename__ = 'accounts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    currency = db.Column(db.String(3), nullable=False)
    balance = db.Column(db.Float, nullable=False)
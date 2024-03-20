from sqlalchemy import Enum
from db import db

TransactionType = Enum("INCOME", "EXPENSE", name="transaction_type")

class Transaction(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
  category_id = db.Column(db.Integer, db.ForeignKey('transaction_categories.id'), nullable=True) # prevents errors on category deletion
  type = db.Column(TransactionType)
  amount = db.Column(db.Float) # regarding dollars and other decimal-based currencies
  date = db.Column(db.DateTime, server_default=db.func.now()) # not the data creation date, but the date of the actual transaction
  third_party_name = db.Column(db.String(128), nullable=True)
  __tablename__ = 'transactions'

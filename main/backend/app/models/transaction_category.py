from db import db

class TransactionCategory(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(128))
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) # nullable because there will be app-default categories and user-defined categories
  def to_dict(self):
    return {
      'id': self.id,
      'name': self.name,
      'user_id': self.user_id
    }
  __tablename__ = 'transaction_categories'

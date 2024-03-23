from db import db

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(128), unique=True, nullable=False)
  display_name = db.Column(db.String(128))
  def to_dict(self):
    return {
      'id': self.id,
      'username': self.username,
      'display_name': self.display_name
    }
  __tablename__ = 'users'

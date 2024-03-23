from db import db

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(128), unique=True, nullable=False)
  display_name = db.Column(db.String(128))
  __tablename__ = 'users'

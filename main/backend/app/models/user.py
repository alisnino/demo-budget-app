from db import db

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  cognito_id = db.Column(db.String(128))
  display_name = db.Column(db.String(128))
  __tablename__ = 'users'

from models.usuario import db
from datetime import datetime


class Assignacio(db.Model):
    __tablename__ = 'assignacions'

    id = db.Column(db.Integer, primary_key=True)
    usuari_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    recurs_id = db.Column(db.Integer, db.ForeignKey('recursos.id'), nullable=False)
    data_assignacio = db.Column(db.DateTime, default=datetime.utcnow)
    data_retorn = db.Column(db.DateTime)
    activa = db.Column(db.Boolean, default=True)
    notes = db.Column(db.Text)

    usuari = db.relationship('Usuario', backref='assignacions')
    recurs = db.relationship('Recurso', backref='assignacions')

    def to_dict(self):
        return {
            'id': self.id,
            'usuari_id': self.usuari_id,
            'recurs_id': self.recurs_id,
            'data_assignacio': self.data_assignacio.isoformat() if self.data_assignacio else None,
            'data_retorn': self.data_retorn.isoformat() if self.data_retorn else None,
            'activa': self.activa,
            'notes': self.notes,
            'usuari_email': self.usuari.email if self.usuari else None,
            'recurs_codi': self.recurs.codi if self.recurs else None,
        }

from sqlalchemy import Column,Integer,String,Float,Date,ForeignKey
from sqlalchemy.orm import relationship
from datetime import date
from .database import Base

class Category(Base):

    __tablename__='categories'

    id = Column(Integer,primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    transactions = relationship('Transaction', back_populates='category')


class Transaction(Base):

    __tablename__='transactions'

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True)
    amount = Column(Float)
    type = Column(String)
    date = Column(Date, default=date.today())

    category_id = Column(Integer, ForeignKey('categories.id'))

    category = relationship('Category', back_populates='transactions')
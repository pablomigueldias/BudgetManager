from pydantic import BaseModel
from datetime import date
from typing import List,Optional


class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int
    class Config:
        from_attributes = True



class TransactionBase(BaseModel):
    discription: str
    amount: float
    type: str
    date: date


class TrasactionCreate(TransactionBase):
    category_id: int


class Transaction(TransactionBase):
    id: int
    category: Category

    class Config:
        from_attributes = True
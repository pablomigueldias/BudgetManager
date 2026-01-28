from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)

@router.post("/", response_model=schemas.Transaction, status_code=status.HTTP_201_CREATED)
def create_transaction(transaction: schemas.TrasactionCreate, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(
        models.Category.id == transaction.category_id).first()
    if not db_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Category not found')
    
    new_transaction = models.Transaction(**transaction.model_dump())
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

@router.get("/", response_model=List[schemas.Transaction])
def read_transactions(
    skip: int = 0,
    limit: int = 100,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Transaction)

    if start_date:
        query = query.filter(models.Transaction.date >= start_date)

    if end_date:
        query = query.filter(models.Transaction.date <= end_date)

    transactions = query.order_by(
        models.Transaction.date.desc()).offset(skip).limit(limit).all()

    return transactions

@router.put("/{transaction_id}", response_model=schemas.Transaction)
def update_transaction(transaction_id: int, transaction: schemas.TrasactionCreate, db: Session = Depends(get_db)):
    db_transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id).first()

    if not db_transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Transaction not found')

    db_transaction.description = transaction.description #type: ignore
    db_transaction.amount = transaction.amount #type: ignore
    db_transaction.type = transaction.type #type: ignore
    db_transaction.date = transaction.date #type: ignore
    db_transaction.category_id = transaction.category_id #type: ignore

    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.delete('/{transaction_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id).first()

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Transaction not found')

    db.delete(transaction)
    db.commit()

    return None
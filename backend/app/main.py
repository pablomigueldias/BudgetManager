from fastapi import FastAPI,Depends,HTTPException,status
from typing import List
from sqlalchemy.orm import Session
from . import models,schemas
from .database import engine,get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title='Budget Manager API')

@app.post('/caregories/', response_model=schemas.Category, status_code=status.HTTP_201_CREATED)
def crate_category(category: schemas.CategoryCreate, db: Session= Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.name == category.name).first()

    if db_category:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Category already exists')
    
    new_category = models.Category(name=category.name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@app.get('/categories/', response_model=List[schemas.Category])
def read_categories(skip: int = 0, limit: int = 100, db: Session=Depends(get_db)):
    categories = db.query(models.Category).offset(skip).limit(limit).all()
    return categories


@app.post('/transactions/', response_model=schemas.Transaction, status_code=status.HTTP_201_CREATED)
def create_transaction(transaction: schemas.TrasactionCreate, db:Session=Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.id == transaction.category_id).first()
    if not db_category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Category not found')
    
    new_transaction = models.Transaction(**transaction.model_dump())
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

@app.get('/transactions/', response_model=List[schemas.Transaction])
def read_transactions(skip: int = 0, limit: int = 100, db: Session=Depends(get_db)):
    transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
    return transactions



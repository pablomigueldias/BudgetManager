from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routers import categories, transactions

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title='Budget Manager API')

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(categories.router)
app.include_router(transactions.router)

@app.get("/")
def root():
    return {"message": "Budget Manager API is running!"}
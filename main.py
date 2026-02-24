from fastapi import FastAPI
from src.controller import Home,joinWaitlist,getWaiters
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.get("/")(Home)
app.post("/waitlist/join")(joinWaitlist)
app.get("/waiters")(getWaiters)

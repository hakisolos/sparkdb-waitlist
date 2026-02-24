from fastapi import FastAPI
from src.controller import Home,joinWaitlist,getWaiters

app = FastAPI()



app.get("/")(Home)
app.post("/waitlist/join")(joinWaitlist)
app.get("/waiters")(getWaiters)

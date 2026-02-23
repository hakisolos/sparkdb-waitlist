from fastapi import FastAPI
from src.controller import Home,joinWaitlist

app = FastAPI()



app.get("/")(Home)
app.post("/waitlist/join")(joinWaitlist)

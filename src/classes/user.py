from pydantic import BaseModel


class User(BaseModel):
    fullname: str
    email: str
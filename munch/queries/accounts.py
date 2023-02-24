from pydantic import BaseModel
from typing import Optional
from queries.pool import pool

class DuplicateAccountError(ValueError):
    pass

class AccountIn(BaseModel):
    first_name: str
    last_name: str
    email: str
    username: str
    password: str
    bio: str


class AccountOut(BaseModel):
    #tried switching the order
    id: int
    first_name: str
    last_name: str
    email: str
    username: str
    bio: str


class AccountOutWithPassword(AccountOut):
    hashed_password: str

class AccountQueries():
    def record_to_account_out(self, record) -> AccountOutWithPassword:
        account_dict = {
            "id": record[0],
            "first_name": record[1],
            "last_name": record[2],
            "email": record[3],
            "username": record[4],
            "hashed_password": record[5],
            "bio": record[6]
        }

        return account_dict

    def get(self, username: str) -> AccountOutWithPassword:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT id, first_name, last_name, email, username, hashed_password, bio
                        FROM users
                        WHERE username = %s
                        """,
                        [username],
                    )
                    record = result.fetchone()
                    if record is None:
                        return None
                    return self.record_to_account_out(record)
        except Exception:
            return {"message": "Could not get account"}

    def create(self, user: AccountIn, hashed_password: str) -> AccountOutWithPassword:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        INSERT INTO users
                            (first_name, last_name, email, username, hashed_password, bio)
                        VALUES
                            (%s, %s, %s, %s, %s, %s)
                        RETURNING id, first_name, last_name, email, username, hashed_password, bio;
                        """,
                        [user.first_name,
                         user.last_name,
                         user.email,
                         user.username,
                         hashed_password,
                         user.bio,
                        ]
                    )
                    id = result.fetchone()[0]
                    return AccountOutWithPassword(
                        id=id,
                        username=user.username,
                        first_name=user.first_name,
                        last_name=user.last_name,
                        email=user.email,
                        hashed_password=hashed_password,
                        bio=user.bio
                    )
        except Exception:
            return {"message": "Could not create a user"}

    def account_in_to_out(self, id: int, hashed_password: str, user: AccountIn):
        old_data = user.dict()
        return AccountOutWithPassword(id=id, hashed_password=hashed_password, **old_data)
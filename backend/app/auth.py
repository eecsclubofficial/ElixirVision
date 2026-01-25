from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.supabase_client import supabase_client

router = APIRouter(prefix="/auth", tags=["Auth"])

# ------------------ Schemas ------------------

class SignupRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# ------------------ Routes ------------------

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(data: SignupRequest):
    try:
        res = supabase_client.auth.admin.create_user({
            "email": data.email,
            "password": data.password,
            "email_confirm": True
        })

        if not res or not res.user:
            raise HTTPException(
                status_code=400,
                detail="Signup failed"
            )

        return {
            "message": "User created successfully",
            "user_id": res.user.id,
            "email": res.user.email
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post("/login")
def login(data: LoginRequest):
    try:
        res = supabase_client.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })

        if not res or not res.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        return {
            "access_token": res.session.access_token,
            "refresh_token": res.session.refresh_token,
            "token_type": "bearer",
            "user": {
                "id": res.user.id,
                "email": res.user.email
            }
        }

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

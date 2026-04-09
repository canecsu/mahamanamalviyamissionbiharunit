import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Dict, List, Optional

import jwt
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field
from supabase import Client, create_client

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "your-supabase-url")
# CRITICAL: Use the SERVICE_ROLE key here, not the ANON key!
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "your-supabase-service-role-key")

# --- AUTH CONFIGURATION ---
SECRET_KEY = os.environ.get("SECRET_KEY", "your-super-secret-jwt-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 Days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

app = FastAPI(title="Mahamana Admin API")

# ==========================================
# THE SILVER BULLET CORS FIX
# ==========================================
# Since we are using Bearer tokens in headers, we don't need credentials=True.
# This allows us to use a wildcard "*" safely and stops Vercel CORS blocking.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ==========================================
# MODELS
# ==========================================

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str = Field(min_length=2)
    # Role is removed from here for security. It will be hardcoded in the route.

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class PageModel(BaseModel):
    title: str = Field(min_length=2)
    slug: str = Field(min_length=2)
    content: str = ""
    language: str = "en"
    published: bool = False

class GalleryItemModel(BaseModel):
    url: str = Field(min_length=5)
    caption: str = ""
    alt: str = ""
    order: int = 0

class MemberModel(BaseModel):
    name: str = Field(min_length=2)
    role: str = ""
    photo_url: str = ""
    bio: str = ""

class NewsModel(BaseModel):
    title: str = Field(min_length=3)
    description: str = Field(min_length=5)
    image_url: str = ""
    date: Optional[str] = None
    status: str = "draft"
    published: bool = False

class ActivityModel(BaseModel):
    title: str = Field(min_length=3)
    description: str = Field(min_length=5)
    image_url: str = ""
    gallery: List[str] = []
    date: Optional[str] = None
    category: str = "General"
    status: str = "draft"
    published: bool = False

class EventModel(BaseModel):
    year: int = Field(ge=1900, le=2200)
    title: str = Field(min_length=3)
    slug: str = Field(min_length=2)
    description: str = ""
    images: List[str] = []
    video_links: List[str] = []
    status: str = "draft"
    published: bool = False

class BlogModel(BaseModel):
    title: str = Field(min_length=3)
    slug: str = Field(min_length=2)
    content: str = Field(min_length=5)
    author: str = "Admin"
    image_url: str = ""
    date: Optional[str] = None
    status: str = "draft"
    published: bool = False

class VideoModel(BaseModel):
    title: str = Field(min_length=3)
    video_url: str = Field(min_length=8)
    thumbnail_url: str = ""
    event_id: Optional[int] = None
    event_year: Optional[int] = None
    status: str = "draft"
    published: bool = False

class StoreItemModel(BaseModel):
    product_name: str = Field(min_length=2)
    category: str = "General"
    description: str = ""
    price: float = Field(ge=0)
    stock: int = Field(ge=0, default=0)
    image_url: str = ""
    status: str = "active"
    published: bool = True

class DonationModel(BaseModel):
    donor_name: str = Field(min_length=2)
    email: Optional[str] = None
    phone: Optional[str] = None
    amount: float = Field(ge=1)
    transaction_id: str = Field(min_length=3)
    message: str = ""
    status: str = "submitted"

# ==========================================
# AUTHENTICATION & SECURITY UTILS
# ==========================================

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    res = supabase.table("users").select("*").eq("email", email).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    return res.data[0]

def require_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

def require_client(user: dict = Depends(get_current_user)):
    if user.get("role") not in ["client", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    return user

def with_timestamps(payload: Dict) -> Dict:
    now = datetime.now(timezone.utc).isoformat()
    payload.setdefault("created_at", now)
    payload["updated_at"] = now
    return payload

def handle_db_response(response, single: bool = False):
    if not response.data:
        if single:
            raise HTTPException(status_code=404, detail="Resource not found")
        return []
    return response.data[0] if single else response.data

# ==========================================
# AUTHENTICATION ROUTES
# ==========================================

@app.post("/auth/register", status_code=status.HTTP_201_CREATED)
def register_user(payload: UserCreate):
    existing = supabase.table("users").select("id").eq("email", payload.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = get_password_hash(payload.password)
    user_doc = {
        "email": payload.email,
        "password_hash": hashed_pw,
        "name": payload.name,
        "role": "client" # HARDCODED FOR SECURITY
    }
    user_doc = with_timestamps(user_doc)
    
    res = supabase.table("users").insert(user_doc).execute()
    new_user = handle_db_response(res, single=True)
    
    new_user.pop("password_hash", None)
    return {"message": "User created successfully", "user": new_user}

@app.post("/auth/login", response_model=Token)
def login_user(payload: UserLogin):
    res = supabase.table("users").select("*").eq("email", payload.email).execute()
    if not res.data:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user = res.data[0]
    
    if not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=access_token_expires
    )
    
    user_info = {
        "id": user.get("id"),
        "email": user["email"],
        "name": user["name"],
        "role": user["role"]
    }
    
    return {"access_token": access_token, "token_type": "bearer", "user": user_info}

@app.get("/auth/me")
def get_my_profile(current_user: dict = Depends(get_current_user)):
    current_user.pop("password_hash", None)
    return current_user

@app.get("/healthz")
def health():
    return {"status": "ok", "database": "Supabase Connected"}

# ==========================================
# DYNAMIC CRUD ROUTES GENERATOR
# ==========================================

def create_crud_routes(path: str, table_name: str, model: BaseModel, include_public_filter: bool = False):
    
    @app.post(f"/admin/{path}", dependencies=[Depends(require_admin)])
    def create_item(payload: model):
        doc = with_timestamps(payload.model_dump())
        res = supabase.table(table_name).insert(doc).execute()
        return handle_db_response(res, single=True)

    @app.get(f"/{path}")
    def list_items(include_unpublished: bool = Query(False)):
        query = supabase.table(table_name).select("*")
        if include_public_filter and not include_unpublished:
            query = query.eq("published", True)
        res = query.order("created_at", desc=True).execute()
        return handle_db_response(res)

    @app.get(f"/admin/{path}", dependencies=[Depends(require_admin)])
    def admin_list_items():
        res = supabase.table(table_name).select("*").order("created_at", desc=True).execute()
        return handle_db_response(res)

    @app.get(f"/{path}/{{item_id}}")
    def get_item(item_id: int):
        res = supabase.table(table_name).select("*").eq("id", item_id).execute()
        return handle_db_response(res, single=True)

    @app.put(f"/admin/{path}/{{item_id}}", dependencies=[Depends(require_admin)])
    def update_item(item_id: int, payload: model):
        doc = payload.model_dump(exclude_unset=True)
        doc["updated_at"] = datetime.now(timezone.utc).isoformat()
        res = supabase.table(table_name).update(doc).eq("id", item_id).execute()
        return handle_db_response(res, single=True)

    @app.delete(f"/admin/{path}/{{item_id}}", dependencies=[Depends(require_admin)])
    def delete_item(item_id: int):
        res = supabase.table(table_name).delete().eq("id", item_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"deleted": True, "id": item_id}

# Initialize all CRUD routes
create_crud_routes("pages", "pages", PageModel)
create_crud_routes("gallery", "gallery", GalleryItemModel)
create_crud_routes("members", "members", MemberModel)
create_crud_routes("news", "news", NewsModel, include_public_filter=True)
create_crud_routes("activities", "activities", ActivityModel, include_public_filter=True)
create_crud_routes("events", "events", EventModel, include_public_filter=True)
create_crud_routes("blogs", "blogs", BlogModel, include_public_filter=True)
create_crud_routes("videos", "videos", VideoModel, include_public_filter=True)
create_crud_routes("store", "store", StoreItemModel, include_public_filter=True)
create_crud_routes("donations", "donations", DonationModel)

# ==========================================
# SPECIFIC / CUSTOM ROUTES
# ==========================================

@app.get("/pages/slug/{slug}")
def get_page_by_slug(slug: str):
    res = supabase.table("pages").select("*").eq("slug", slug).execute()
    return handle_db_response(res, single=True)

@app.get("/blogs/slug/{slug}")
def get_blog_by_slug(slug: str):
    res = supabase.table("blogs").select("*").eq("slug", slug).eq("published", True).execute()
    return handle_db_response(res, single=True)

@app.get("/events/year/{year}")
def get_events_by_year(year: int):
    res = supabase.table("events").select("*").eq("year", year).eq("published", True).order("created_at", desc=True).execute()
    return handle_db_response(res)

@app.post("/donations/request")
def create_donation_request(payload: DonationModel):
    doc = with_timestamps(payload.model_dump())
    res = supabase.table("donations").insert(doc).execute()
    return handle_db_response(res, single=True)

@app.get("/client/dashboard", dependencies=[Depends(require_client)])
def get_client_dashboard(current_user: dict = Depends(get_current_user)):
    return {
        "message": f"Welcome to the client portal, {current_user['name']}!",
        "role": current_user['role']
    }

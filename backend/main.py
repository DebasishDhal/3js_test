from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
import os

class AvatarPosition(BaseModel):
    x: float
    y: float
    z: float

app = FastAPI()

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://mongodb:27017")
client = MongoClient(MONGODB_URL)
db = client.avatar_db
avatar_collection = db.positions

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def create_indexes():
    # Create an index on player_id for faster lookups
    avatar_collection.create_index("player_id", unique=True)

@app.get("/")
def read_root():
    return {"message": "Avatar movement server is running"}

@app.get("/avatar/position/{player_id}")
def get_avatar_position(player_id: str):
    position = avatar_collection.find_one({"player_id": player_id}, {"_id": 0})
    if position:
        return {
            "x": position["x"],
            "y": position["y"],
            "z": position["z"]
        }
    return {"x": 0, "y": 0, "z": 0}  # Default position for new players

@app.post("/avatar/position/{player_id}")
def update_avatar_position(player_id: str, position: AvatarPosition):
    result = avatar_collection.update_one(
        {"player_id": player_id},
        {
            "$set": {
                "x": position.x,
                "y": position.y,
                "z": position.z
            }
        },
        upsert=True
    )
    
    if result.modified_count > 0 or result.upserted_id:
        return {"status": "success"}
    raise HTTPException(status_code=500, detail="Failed to update position")

@app.get("/avatar/all")
def get_all_avatars():
    positions = list(avatar_collection.find({}, {"_id": 0}))
    return positions 
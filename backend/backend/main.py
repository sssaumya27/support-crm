from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from sqlalchemy.orm import Session
from database import engine, SessionLocal
from models import Base, Ticket
from schemas import TicketCreate, TicketUpdate
from datetime import datetime
from fastapi import Query

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "Support CRM Running"}

@app.post("/api/tickets")
def create_ticket(ticket: TicketCreate):

    db: Session = SessionLocal()

    ticket_count = db.query(Ticket).count()

    new_ticket = Ticket(
        ticket_id=f"TKT-{ticket_count+1:03}",
        customer_name=ticket.customer_name,
        customer_email=ticket.customer_email,
        subject=ticket.subject,
        description=ticket.description,
        status="Open",
        created_at=datetime.utcnow()
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return {
        "ticket_id": new_ticket.ticket_id,
        "created_at": new_ticket.created_at
    }

@app.get("/api/tickets")
def get_tickets(
    search: str = "",
    status: str = ""
):

    db = SessionLocal()

    tickets = db.query(Ticket).all()

    if search:

        tickets = [
            ticket for ticket in tickets
            if search.lower() in ticket.customer_name.lower()
            or search.lower() in ticket.customer_email.lower()
            or search.lower() in ticket.subject.lower()
            or search.lower() in ticket.ticket_id.lower()
        ]

    if status:

        tickets = [
            ticket for ticket in tickets
            if ticket.status.lower() == status.lower()
        ]

    return tickets

@app.get("/api/tickets/{ticket_id}")
def get_ticket(ticket_id: str):

    db = SessionLocal()

    ticket = db.query(Ticket).filter(
        Ticket.ticket_id == ticket_id
    ).first()

    return ticket

@app.put("/api/tickets/{ticket_id}")
def update_ticket(ticket_id: str, data: TicketUpdate):

    db = SessionLocal()

    ticket = db.query(Ticket).filter(
        Ticket.ticket_id == ticket_id
    ).first()

    if not ticket:
        return {"error": "Ticket not found"}

    ticket.status = data.status

    db.commit()

    return {
        "success": True,
        "new_status": ticket.status
    }
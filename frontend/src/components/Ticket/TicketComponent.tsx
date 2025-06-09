"use client";
import { ITicket } from '@/models/ITicket';
import { FC } from 'react';
import { ticketService } from '@/services/api.services';

interface IProps {
  ticket: ITicket;
  isEditing: boolean;
  onDelete: () => void;
}

const TicketComponent:FC<IProps> = ({ticket, isEditing, onDelete}) => {


  return (
    <div>
      <a href={ticket.file_url} target="_blank" rel="noopener noreferrer">
        {ticket.name}
      </a>
      {isEditing && (
        <div>
          <button onClick={onDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}
export default TicketComponent;
import { FC, useEffect, useRef, useState } from 'react';
import { ITicket } from '@/models/ITicket';
import { ticketService, tripService } from '@/services/api.services';
import TicketComponent from '@/components/Ticket/TicketComponent';
import CreateTicketModal from '@/modals/CreateTicketModal';

interface IProps {
  tripId: string;
}

const TicketsComponent: FC<IProps> = ({ tripId }) => {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEditClick = () => {
    setIsEditing(prev => !prev);
  };


  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleSaveTicket = async (data: ITicket) => {
    try {
      const newTicket = await ticketService.createTicket(tripId, { name: data.name });

      if (uploadedFile) {
        await ticketService.uploadFile(newTicket.id!, uploadedFile);
      }

      const updatedTickets = await tripService.getTripTickets(tripId);
      setTickets(updatedTickets);
      setIsModalOpen(false);
      setUploadedFile(null);
    } catch (err) {
      console.error('Failed to save ticket:', err);
    }
  };

  const handleUploadFile = (file: File) => {
    setUploadedFile(file);
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      await ticketService.deleteFile(ticketId);
      await ticketService.deleteTicket(ticketId);
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
    } catch (err) {
      console.error('Failed to delete ticket:', err);
    }
  };


    useEffect(() => {
      const fetchTickets = async () => {
        try {
          const fetchedTickets = await tripService.getTripTickets(tripId);
          setTickets(fetchedTickets);
        } catch (err) {
          console.error('Failed to fetch tickets:', err);
        }
      };
      fetchTickets();
    }, [tripId]);

    useEffect(() => {
      console.log('Updated tickets:', tickets);
    }, [tickets]);


    if (tickets.length === 0) {
      return (
        <div>
          <p>No tickets available. <button onClick={handleModalOpen}>Add your ticket</button></p>
          <CreateTicketModal open={isModalOpen} onOpenChangeAction={setIsModalOpen} handleSaveTicketAction={handleSaveTicket} handleUploadFileAction={handleUploadFile}/>
        </div>
      );
    }

    return (
      <div>
        {
          tickets.map((ticket) => (
            <div key={ticket.id}>
              <TicketComponent ticket={ticket} isEditing={isEditing} onDelete={() => handleDeleteTicket(ticket.id!)} />
            </div>
          ))
        }
        <button onClick={handleEditClick}>{isEditing ? 'Done' : 'Edit'}</button>
        <button onClick={handleModalOpen}>Add ticket</button>
        <CreateTicketModal open={isModalOpen} onOpenChangeAction={setIsModalOpen}
                           handleSaveTicketAction={handleSaveTicket} handleUploadFileAction={handleUploadFile} />

      </div>
    );
  };
  export default TicketsComponent;
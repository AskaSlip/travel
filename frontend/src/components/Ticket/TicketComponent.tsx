"use client";
import { ITicket } from '@/models/ITicket';
import { FC } from 'react';
import Link from 'next/link';

interface IProps {
  ticket: ITicket;
}

const TicketComponent:FC<IProps> = ({ticket}) => {
//TODO ЗРОБИТИ МОДАЛКУ ДЛЯ ДОДАВАННЯ ТІКЕТУ І КНОПКИ ДЛЯ ЗМІНИ .ВИДАЛЕННЯ
//   І ПРОСТО ВИВЕСТИ ЇХ НА СТОРІНКУ З ПОДОРОЖЖЮ


  return (
    <div>
      <h1>{ticket.name}</h1>
      <p>Ticket ID: {ticket.id}</p>
      {/*<Link href={#}>your ticket</Link>*/}
    </div>
  );
}
export default TicketComponent;
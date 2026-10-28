import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from './usetoast';
import {
  SupportService,
  SupportTicketPriority,
  SupportTicketStatus,
} from '../services/SupportService';

const getErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message || error?.message || fallback;

export const useSupport = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getTicketsQuery = (params: object) => {
    return useQuery({
      queryKey: ['getTicketsQuery', params],
      queryFn: () => SupportService.getTickets(params),
    });
  };

  const getTicketQuery = (ticketId: string) => {
    return useQuery({
      queryKey: ['getTicket', ticketId],
      queryFn: () => SupportService.getTicketById(ticketId),
      enabled: Boolean(ticketId),
    });
  };

  const invalidateTicket = (ticketId: string) => {
    queryClient.invalidateQueries({ queryKey: ['getTicket', ticketId] });
    queryClient.invalidateQueries({ queryKey: ['getTicketsQuery'] });
  };

  const updateTicketStatusMutation = useMutation({
    mutationFn: ({
      ticketId,
      status,
    }: {
      ticketId: string;
      status: SupportTicketStatus;
    }) => SupportService.updateTicketStatus(ticketId, status),
    onSuccess: (_data, variables) => {
      invalidateTicket(variables.ticketId);
      toast.success('Success', 'Ticket status updated');
    },
    onError: (error: any) => {
      toast.error('Error', getErrorMessage(error, 'Failed to update ticket status'));
    },
  });

  const updateTicketPriorityMutation = useMutation({
    mutationFn: ({
      ticketId,
      priority,
    }: {
      ticketId: string;
      priority: SupportTicketPriority;
    }) => SupportService.updateTicketPriority(ticketId, priority),
    onSuccess: (_data, variables) => {
      invalidateTicket(variables.ticketId);
      toast.success('Success', 'Ticket priority updated');
    },
    onError: (error: any) => {
      toast.error('Error', getErrorMessage(error, 'Failed to update ticket priority'));
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: SupportService.createTickets,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getTicketsQuery'] });
      toast.success('Success', 'Ticket created successfully');
    },
    onError: (error: any) => {
      toast.error('Error', getErrorMessage(error, 'Failed to create ticket'));
    },
  });

  return {
    getTicketsQuery,
    getTicketQuery,
    createTicketMutation,
    updateTicketStatusMutation,
    updateTicketPriorityMutation,
  };
};

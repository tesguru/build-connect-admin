import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from './usetoast';
import { EscrowService } from '../services/EscrowService';
import { handleApiError } from '../utils/handleapierror';

export const useEscrow = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const paymentInstructions = (params: object) => {
    return useQuery({
      queryKey: ['paymentInstructions', params],
      queryFn: () => EscrowService.getPaymentInstructions(params),
    });
  };

  const paymentInstructionDetailQuery = (id: string) => {
    return useQuery({
      queryKey: ['paymentInstructionDetail', id],
      queryFn: () => EscrowService.getPaymentInstructionById(id),
      enabled: Boolean(id),
    });
  };

  const getWalletFundingQuery = (params: object) => {
    return useQuery({
      queryKey: ['walletfunding', params],
      queryFn: () => EscrowService.getWalletFunding(params),
    });
  };

  const walletFundingDetailQuery = (id: string) => {
    return useQuery({
      queryKey: ['walletFundingDetail', id],
      queryFn: () => EscrowService.getWalletFundingById(id),
      enabled: Boolean(id),
    });
  };

  const updatePaymentInstructions = useMutation({
    mutationFn: EscrowService.updatePaymentInstructions,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['paymentInstructions'] });
      queryClient.invalidateQueries({ queryKey: ['paymentInstructionDetail', variables.instructionId] });
      toast.success("Success", "Payment instruction status updated");
    },
    onError: (error: any) => {
      handleApiError(error, "Failed to update payment instruction", toast);
    },
  });

  const updateWalletFunding = useMutation({
    mutationFn: EscrowService.updateWalletFunding,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['walletfunding'] });
      queryClient.invalidateQueries({ queryKey: ['walletFundingDetail', variables.fundingId] });
      toast.success("Success", "Wallet funding status updated");
    },
    onError: (error: any) => {
      handleApiError(error, "Failed to update wallet funding", toast);
    },
  });

  return {
    paymentInstructions,
    paymentInstructionDetailQuery,
    getWalletFundingQuery,
    walletFundingDetailQuery,
    updatePaymentInstructions,
    updateWalletFunding,
  };
};
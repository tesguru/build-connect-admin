import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from './usetoast';
import { useAuthStore } from '../store/Authstore';
import { AuthService } from '../services/AuthServices';
import { handleApiError } from '../utils/handleapierror';
import { UserService } from '../services/UserServices';
// import { handleApiError } from '../utils/handleapierror';
// import { URLS } from '../constants/pageurl';
// import { encryptUrl } from '../utils/helpers';





export const useUsers = () => {
  const router = useRouter();
const { toast } = useToast();
const queryClient = useQueryClient();
  
const userQuery = (params: any) => {
  return useQuery({
    queryKey: ['users', params], 
    queryFn: () => UserService.getallusers(params),
  });
};

const singleUserQuery = (id :any) => {
  return useQuery({
    queryKey: ['singleuser', id], 
    queryFn: () => UserService.getSingleUser(id),
  });
};

const singleBuilderQuery = (id: string) => {
    return useQuery({
      queryKey: ['builder', id], // Different query key
      queryFn: () => UserService.getSingleUser(id), // Same service method
      enabled: !!id,
    });
  };

const updateUserStatusMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: any }) =>
    UserService.updateUserStatus(id, data),
  onSuccess: (_res, variables) => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.invalidateQueries({ queryKey: ['singleuser', variables.id] });
    queryClient.invalidateQueries({ queryKey: ['builder', variables.id] });
    toast.success("Success", "User status updated");
  },
  onError: (error: any) => {
    handleApiError(error, "Failed to update user status", toast);
  },
});

const activityQuery = (id :string, params: object) => {
  return useQuery({
    queryKey: ['userActivity', id, params], 
    queryFn: () => UserService.getActivity(id, params),
  });
};

const bidQuery = (id :string, params: object) => {
  return useQuery({
    queryKey: ['userBids', id, params], 
    queryFn: () => UserService.getBids(id, params),
  });
};

const bidDetailQuery = (id: string, bidId: string) => {
  return useQuery({
    queryKey: ['userBidDetail', id, bidId],
    queryFn: () => UserService.getBidDetail(id, bidId),
    enabled: Boolean(id && bidId),
  });
};
 
const projectsQuery = (id :string, params: object) => {
  return useQuery({
    queryKey: ['userProjects', id, params], 
    queryFn: () => UserService.getProjects(id, params),
  });
};

const documentsQuery = (id :string, params: object) => {
  return useQuery({
    queryKey: ['userDocuments', id, params], 
    queryFn: () => UserService.getDocuments(id, params),
  });
};

 const createClientMutation = useMutation({
    mutationFn: UserService.createClients,
    onSuccess: (data) => {
      toast.success("Success", "Client created successfully");
    //   onClose();
    //   methods.reset();
    //   onSuccess?.();
    },
    onError: (error: any) => {
      toast.error("Error", "Failed to create client");
      console.error('Create client error:', error);
    }
  });

  

   const createBuildersMutation = useMutation({
    mutationFn: UserService.createBuilders,
    onSuccess: (data) => {
      toast.success("Success", "Client created successfully");
    //   onClose();
    //   methods.reset();
    //   onSuccess?.();
    },
    onError: (error: any) => {
      toast.error("Error", "Failed to create client");
      console.error('Create client error:', error);
    }
  });

   const getAllAccountDeletionQuery = (params: object) => {
  return useQuery({
    queryKey: ['getAllAccountDeltionquery',  params], 
    queryFn: () => UserService.getAllAccountDeletions( params),
  });
};
 const requestAccountDeletion = useMutation({
  mutationFn: ({ id, data }: { id: string; data: any }) =>
    UserService.deleteAccount(id, data),
  onSuccess: (data) => {
    toast.success("Success", "Account deletion requested successfully");
    //   onClose();
    //   methods.reset();
    //   onSuccess?.();
  },
  onError: (error: any) => {
    handleApiError(error, "An error occured", toast);
  },
});

const adminQuery = (params: object) => {
  return useQuery({
    queryKey: ['admins', params],
    queryFn: () => UserService.getAdmin(params),
  });
};

const createAdminMutation = useMutation({
  mutationFn: UserService.createAdmin,
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ['admins'] });
    toast.success("Success", "Admin account created successfully");
  },
  onError: (error: any) => {
    handleApiError(error, "Failed to create admin", toast);
  },
});

const adminDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['adminDetail', id],
    queryFn: () => UserService.getAdminById(id),
    enabled: Boolean(id),
  });
};

const updateAdminMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: any }) =>
    UserService.updateAdmin(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admins'] });
    queryClient.invalidateQueries({ queryKey: ['adminDetail'] });
    toast.success("Success", "Admin account updated successfully");
  },
  onError: (error: any) => {
    handleApiError(error, "Failed to update admin", toast);
  },
});

const deleteAdminMutation = useMutation({
  mutationFn: (id: string) => UserService.deleteAdmin(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admins'] });
    toast.success("Success", "Admin account deleted successfully");
  },
  onError: (error: any) => {
    handleApiError(error, "Failed to delete admin", toast);
  },
});

// Deactivating ends the admin's sessions server-side, so the row has to re-render with the new flag.
const deactivateAdminMutation = useMutation({
  mutationFn: (id: string) => UserService.deactivateAdmin(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admins'] });
    queryClient.invalidateQueries({ queryKey: ['adminDetail'] });
    toast.success("Success", "Admin account deactivated");
  },
  onError: (error: any) => {
    handleApiError(error, "Failed to deactivate admin", toast);
  },
});

const activateAdminMutation = useMutation({
  mutationFn: (id: string) => UserService.activateAdmin(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admins'] });
    queryClient.invalidateQueries({ queryKey: ['adminDetail'] });
    toast.success("Success", "Admin account reactivated");
  },
  onError: (error: any) => {
    handleApiError(error, "Failed to activate admin", toast);
  },
});

// Resending issues a fresh setup code and cancels the previous one, so refresh the list/detail.
const resendInviteMutation = useMutation({
  mutationFn: (id: string) => UserService.resendInvite(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admins'] });
    queryClient.invalidateQueries({ queryKey: ['adminDetail'] });
    toast.success("Success", "Invite resent — a new setup code was emailed.");
  },
  onError: (error: any) => {
    handleApiError(error, "Failed to resend invite", toast);
  },
});

  return { 
    userQuery,
    singleUserQuery,
    activityQuery,
    projectsQuery,
    documentsQuery,
    singleBuilderQuery,
    updateUserStatusMutation,
    createClientMutation,
    createBuildersMutation,
    bidQuery,
    bidDetailQuery,
    getAllAccountDeletionQuery,
    requestAccountDeletion,
    adminQuery,
    adminDetailQuery,
    createAdminMutation,
    updateAdminMutation,
    deleteAdminMutation,
    activateAdminMutation,
    deactivateAdminMutation,
    resendInviteMutation
   };
};
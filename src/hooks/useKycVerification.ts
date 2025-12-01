import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface KycVerification {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  document_type: string;
  document_url?: string;
  submitted_at: string;
  reviewed_at?: string;
  rejection_reason?: string;
}

export const useKycVerification = () => {
  const queryClient = useQueryClient();

  const { data: kycStatus, isLoading } = useQuery({
    queryKey: ['kyc-verification'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch KYC status:", error);
        return null;
      }

      return data as KycVerification | null;
    }
  });

  const submitKyc = useMutation({
    mutationFn: async ({ documentType, documentUrl }: { documentType: string; documentUrl: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('kyc_verifications')
        .insert({
          user_id: user.id,
          document_type: documentType,
          document_url: documentUrl,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc-verification'] });
      toast.success("KYC documents submitted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to submit KYC documents");
      console.error("KYC submission error:", error);
    }
  });

  return {
    kycStatus,
    isLoading,
    submitKyc
  };
};
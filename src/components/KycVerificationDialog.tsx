import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Upload, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useKycVerification } from '@/hooks/useKycVerification';

export const KycVerificationDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [documentType, setDocumentType] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const { kycStatus, submitKyc } = useKycVerification();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!documentType || !documentFile) return;

    // In a real implementation, you would upload the file to storage first
    // For now, we'll use a placeholder URL
    const documentUrl = `https://placeholder-storage.com/${documentFile.name}`;
    
    await submitKyc.mutateAsync({ documentType, documentUrl });
    setIsOpen(false);
    setDocumentType('');
    setDocumentFile(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Shield className="h-4 w-4" />
          KYC Verification
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Identity Verification
          </DialogTitle>
        </DialogHeader>

        {kycStatus ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {getStatusIcon(kycStatus.status)}
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Badge className={getStatusColor(kycStatus.status)}>
                  {kycStatus.status.toUpperCase()}
                </Badge>
                <div>
                  <p className="text-sm text-muted-foreground">Document Type:</p>
                  <p className="font-medium">{kycStatus.document_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted:</p>
                  <p className="text-sm">{new Date(kycStatus.submitted_at).toLocaleDateString()}</p>
                </div>
                {kycStatus.status === 'rejected' && kycStatus.rejection_reason && (
                  <div>
                    <p className="text-sm text-muted-foreground">Rejection Reason:</p>
                    <p className="text-sm text-red-600">{kycStatus.rejection_reason}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <CardDescription>
              Please upload a government-issued ID to verify your identity.
            </CardDescription>
            
            <div className="space-y-2">
              <Label htmlFor="document-type">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drivers_license">Driver's License</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="national_id">National ID</SelectItem>
                  <SelectItem value="state_id">State ID</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document-file">Upload Document</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="document-file"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Accepted formats: JPG, PNG, PDF (max 10MB)
              </p>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={!documentType || !documentFile || submitKyc.isPending}
              className="w-full"
            >
              {submitKyc.isPending ? 'Submitting...' : 'Submit for Verification'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
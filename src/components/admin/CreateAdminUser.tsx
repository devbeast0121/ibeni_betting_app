
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CreateAdminUser = () => {
  const [loading, setLoading] = useState(false);

  const createAdminUser = async () => {
    try {
      setLoading(true);
      
      console.log('CreateAdminUser: Creating admin user');
      
      // Create admin user with provided credentials
      const { data, error } = await supabase.auth.signUp({
        email: 'ibenisportportfolio@gmail.com',
        password: 'Grizzlee0$',
        options: {
          data: {
            is_admin: true,
          }
        }
      });
      
      if (error) {
        console.error('CreateAdminUser: Error creating admin user:', error);
        throw error;
      }
      
      console.log('CreateAdminUser: Admin user created successfully');
      toast.success('Admin user created! Check email for confirmation if required.');
      
    } catch (error: any) {
      console.error('CreateAdminUser: Error creating admin user:', error);
      toast.error(error.message || 'Failed to create admin user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-md bg-muted/20">
      <h3 className="font-medium mb-2">Admin User Setup</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Create admin user for ibenisportportfolio@gmail.com if it doesn't exist yet.
      </p>
      <Button 
        onClick={createAdminUser} 
        disabled={loading}
        size="sm"
      >
        {loading ? 'Creating...' : 'Create Admin User'}
      </Button>
    </div>
  );
};

export default CreateAdminUser;


import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChartPie } from 'lucide-react';

const AdminLink = () => {
  return (
    <Button variant="ghost" size="sm" asChild>
      <Link to="/admin" className="flex items-center gap-2">
        <ChartPie className="h-4 w-4" />
        <span>Admin</span>
      </Link>
    </Button>
  );
};

export default AdminLink;

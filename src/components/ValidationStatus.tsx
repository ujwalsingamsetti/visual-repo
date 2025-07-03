
import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ValidationStatusProps {
  status: {
    isValid: boolean;
    message: string;
  };
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({ status }) => {
  const getStatusIcon = () => {
    if (status.isValid) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    if (status.isValid) {
      return 'border-green-200 bg-green-50';
    } else {
      return 'border-red-200 bg-red-50';
    }
  };

  return (
    <Card className={`p-4 ${getStatusColor()} border-2 shadow-lg max-w-sm`}>
      <div className="flex items-start gap-3">
        {getStatusIcon()}
        <div>
          <h3 className="font-semibold text-sm text-slate-800">
            DAG Status
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            {status.message}
          </p>
        </div>
      </div>
    </Card>
  );
};

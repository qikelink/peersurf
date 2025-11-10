import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Calendar, Globe, DollarSign, Users, FileText } from "lucide-react";

interface GrantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  grant: {
    id: string;
    title: string;
    category: string;
    amount: number;
    currency: string;
    duration: string;
    repository_url?: string;
    overview: string;
    team_size: string;
    payment_schedule: string;
    status: string;
    created_at: string;
  };
}

const GrantDetailsModal = ({ isOpen, onClose, grant }: GrantDetailsModalProps) => {
  if (!grant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{grant.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{grant.category}</Badge>
            <Badge variant={grant.status === 'submitted' ? 'default' : 'secondary'}>
              {grant.status}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="">Budget:</span>
                <span className="text-[#3366FF] ">
                  {grant.currency} {grant.amount}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="">Duration:</span>
                <span>{grant.duration}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span>Team Size:</span>
                <span>{grant.team_size}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span>Payment Schedule:</span>
                <span>{grant.payment_schedule}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {grant.repository_url && (
                <div className="flex items-center gap-2">
                  <span >Repository:</span>
                  <a 
                    href={grant.repository_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Repository
                  </a>
                </div>
              )}
              
              <div >
                <span >Created:</span> {new Date(grant.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Project Overview</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="whitespace-pre-wrap"> {grant.overview}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GrantDetailsModal;

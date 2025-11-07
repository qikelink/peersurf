import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { User, FileText, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

interface Submission {
  id: string;
  user_id: string;
  bounty_id: string;
  project_name: string;
  project_url?: string | null;
  description: string;
  attachments?: string[] | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

interface BountySubmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bounty: {
    id: string;
    title: string;
  };
}

const BountySubmissionsModal = ({ isOpen, onClose, bounty }: BountySubmissionsModalProps) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && bounty?.id) {
      fetchSubmissions();
    }
  }, [isOpen, bounty?.id]);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch submissions without join (PostgREST can't find the relationship)
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('bounty_submissions')
        .select('*')
        .eq('bounty_id', bounty.id)
        .order('created_at', { ascending: false });

      if (submissionsError) {
        // Log the full error for debugging
        console.error('Error fetching bounty_submissions:', {
          message: submissionsError.message,
          details: submissionsError.details,
          hint: submissionsError.hint,
          code: submissionsError.code,
          error: submissionsError
        });

        // If new table doesn't exist, try legacy submissions table
        if (submissionsError.message.includes('relation "bounty_submissions" does not exist') || 
            submissionsError.message.includes('permission denied')) {
          console.log('Falling back to legacy submissions table');
          const { data: legacyData, error: legacyError } = await supabase
            .from('submissions')
            .select('*')
            .eq('opportunity_id', bounty.id)
            .order('created_at', { ascending: false });
          
          if (legacyError) {
            console.error('Error fetching legacy submissions:', {
              message: legacyError.message,
              details: legacyError.details,
              hint: legacyError.hint,
              code: legacyError.code,
              error: legacyError
            });
            throw legacyError;
          }
          
          // Transform legacy data to match new format
          const transformedData = legacyData?.map(sub => ({
            ...sub,
            bounty_id: sub.opportunity_id,
            project_name: sub.proposal || 'Legacy Submission',
            project_url: sub.links,
            description: sub.proposal,
            attachments: null,
            profiles: undefined // Will fetch separately
          })) || [];
          
          // Fetch profiles for legacy submissions
          const userIds = [...new Set(transformedData.map(sub => sub.user_id))];
          if (userIds.length > 0) {
            const { data: profilesData } = await supabase
              .from('profiles')
              .select('id, username, full_name, avatar_url')
              .in('id', userIds);
            
            const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
            
            const submissionsWithProfiles = transformedData.map(sub => ({
              ...sub,
              profiles: profilesMap.get(sub.user_id) || undefined
            }));
            
            setSubmissions(submissionsWithProfiles);
          } else {
            setSubmissions(transformedData);
          }
          return;
        }
        throw submissionsError;
      }
      
      if (!submissionsData || submissionsData.length === 0) {
        setSubmissions([]);
        return;
      }
      
      // Fetch profiles separately and join them
      const userIds = [...new Set(submissionsData.map(sub => sub.user_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds);
      
      if (profilesError) {
        console.error('Error fetching profiles:', {
          message: profilesError.message,
          details: profilesError.details,
          hint: profilesError.hint,
          code: profilesError.code
        });
        // Continue without profiles if there's an error
      }
      
      // Create a map of user_id to profile for quick lookup
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      
      // Join submissions with profiles
      const submissionsWithProfiles = submissionsData.map(submission => ({
        ...submission,
        profiles: profilesMap.get(submission.user_id) || undefined
      }));
      
      // Log successful data fetch for debugging
      console.log('Successfully fetched submissions:', {
        count: submissionsWithProfiles.length,
        submissionsWithProfiles: submissionsWithProfiles
      });
      
      setSubmissions(submissionsWithProfiles);
    } catch (err) {
      // Log the full error object
      console.error('Exception in fetchSubmissions:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });
      
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmissionAction = async (submissionId: string, action: 'approve' | 'reject') => {
    try {
      // Try new table first
      const { error } = await supabase
        .from('bounty_submissions')
        .update({ 
          status: action === 'approve' ? 'approved' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      if (error) {
        console.error('Error updating bounty_submission:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          submissionId,
          action
        });

        // If new table fails, try legacy table
        if (error.message.includes('relation "bounty_submissions" does not exist') || 
            error.message.includes('permission denied')) {
          console.log('Falling back to legacy submissions table for update');
          const { error: legacyError } = await supabase
            .from('submissions')
            .update({ 
              status: action === 'approve' ? 'approved' : 'rejected',
              updated_at: new Date().toISOString()
            })
            .eq('id', submissionId);
          
          if (legacyError) {
            console.error('Error updating legacy submission:', {
              message: legacyError.message,
              details: legacyError.details,
              hint: legacyError.hint,
              code: legacyError.code
            });
            throw legacyError;
          }
        } else {
          throw error;
        }
      }
      
      // Refresh submissions
      await fetchSubmissions();
    } catch (err) {
      console.error('Exception in handleSubmissionAction:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        submissionId,
        action
      });
      
      setError(err instanceof Error ? err.message : `Failed to ${action} submission`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Submissions for "{bounty?.title}"
          </DialogTitle>
          <DialogDescription>
            Review and manage submissions for this bounty
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading submissions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button onClick={fetchSubmissions} className="mt-2">Try Again</Button>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
              <p>No one has submitted work for this bounty.</p>
            </div>
          ) : (
            submissions.map((submission) => (
              <div key={submission.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {submission.profiles?.full_name || submission.profiles?.username || 'Unknown User'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        @{submission.profiles?.username || 'unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(submission.status)}>
                      {submission.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="font-medium mb-2">Project Name:</h5>
                  <div className="bg-muted p-3 rounded-lg mb-3">
                    <p className="font-medium">{submission.project_name}</p>
                  </div>
                  
                  {submission.project_url && (
                    <>
                      <h5 className="font-medium mb-2">Project URL:</h5>
                      <div className="bg-muted p-3 rounded-lg mb-3">
                        <a 
                          href={submission.project_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline break-all"
                        >
                          {submission.project_url}
                        </a>
                      </div>
                    </>
                  )}
                  
                  <h5 className="font-medium mb-2">Description:</h5>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="whitespace-pre-wrap">{submission.description}</p>
                  </div>
                </div>

                {submission.attachments && submission.attachments.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium mb-2">Attachments:</h5>
                    <div className="space-y-2">
                      {submission.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-500 hover:underline"
                        >
                          <FileText className="w-4 h-4" />
                          Attachment {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {submission.status === 'pending' && (
                  <div className="flex items-center gap-2 pt-3 border-t">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleSubmissionAction(submission.id, 'approve')}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 border-red-500 hover:bg-red-50"
                      onClick={() => handleSubmissionAction(submission.id, 'reject')}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BountySubmissionsModal;

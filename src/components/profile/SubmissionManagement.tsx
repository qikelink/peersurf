import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Target, Briefcase, User, FileText, XCircle, 
  Clock, Trophy, Award, Search, Filter, ChevronDown, ChevronUp
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

interface Submission {
  id: string;
  user_id: string;
  bounty_id?: string;
  grant_id?: string;
  project_name: string;
  project_url?: string | null;
  description: string;
  attachments?: string[] | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  type: 'bounty' | 'grant';
  opportunity_title: string;
  opportunity_id: string;
  profiles?: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

const SubmissionManagement = ({ userId }: { userId: string }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectingWinner, setSelectingWinner] = useState<string | null>(null);
  const [expandedSubmissions, setExpandedSubmissions] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAllSubmissions();
  }, [userId]);

  const fetchAllSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all bounties created by the user
      const { data: bounties, error: bountiesError } = await supabase
        .from('bounties')
        .select('id, title')
        .eq('created_by', userId);

      if (bountiesError) throw bountiesError;

      // Fetch all grants created by the user
      const { data: grants, error: grantsError } = await supabase
        .from('grants')
        .select('id, title')
        .eq('created_by', userId);

      if (grantsError) throw grantsError;

      const allSubmissions: Submission[] = [];

      // Fetch submissions for each bounty
      if (bounties && bounties.length > 0) {
        const bountyIds = bounties.map(b => b.id);
        const { data: bountySubmissions, error: bountySubsError } = await supabase
          .from('bounty_submissions')
          .select('*')
          .in('bounty_id', bountyIds)
          .order('created_at', { ascending: false });

        if (bountySubsError) {
          console.error('Error fetching bounty submissions:', bountySubsError);
        } else if (bountySubmissions) {
          const bountyMap = new Map(bounties.map(b => [b.id, b.title]));
          
          // Fetch profiles for these submissions
          const userIds = [...new Set(bountySubmissions.map(sub => sub.user_id))];
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .in('id', userIds);

          const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

          bountySubmissions.forEach(sub => {
            allSubmissions.push({
              ...sub,
              type: 'bounty',
              opportunity_title: bountyMap.get(sub.bounty_id) || 'Unknown Bounty',
              opportunity_id: sub.bounty_id,
              profiles: profilesMap.get(sub.user_id) || undefined
            });
          });
        }
      }

      // Fetch submissions for each grant
      if (grants && grants.length > 0) {
        const grantIds = grants.map(g => g.id);
        const { data: grantSubmissions, error: grantSubsError } = await supabase
          .from('grant_submissions')
          .select('*')
          .in('grant_id', grantIds)
          .order('created_at', { ascending: false });

        if (grantSubsError) {
          console.error('Error fetching grant submissions:', grantSubsError);
        } else if (grantSubmissions) {
          const grantMap = new Map(grants.map(g => [g.id, g.title]));
          
          // Fetch profiles for these submissions
          const userIds = [...new Set(grantSubmissions.map(sub => sub.user_id))];
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .in('id', userIds);

          const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

          grantSubmissions.forEach(sub => {
            allSubmissions.push({
              ...sub,
              type: 'grant',
              opportunity_title: grantMap.get(sub.grant_id) || 'Unknown Grant',
              opportunity_id: sub.grant_id,
              profiles: profilesMap.get(sub.user_id) || undefined
            });
          });
        }
      }

      // Sort by created_at descending
      allSubmissions.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setSubmissions(allSubmissions);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWinner = async (submissionId: string, type: 'bounty' | 'grant') => {
    if (!window.confirm('Are you sure you want to select this submission as the winner? This action cannot be undone.')) {
      return;
    }

    setSelectingWinner(submissionId);
    try {
      const tableName = type === 'bounty' ? 'bounty_submissions' : 'grant_submissions';
      
      const { error } = await supabase
        .from(tableName)
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      if (error) throw error;

      // Refresh submissions
      await fetchAllSubmissions();
    } catch (err) {
      console.error('Error selecting winner:', err);
      setError(err instanceof Error ? err.message : 'Failed to select winner');
    } finally {
      setSelectingWinner(null);
    }
  };

  const handleRejectSubmission = async (submissionId: string, type: 'bounty' | 'grant') => {
    if (!window.confirm('Are you sure you want to reject this submission?')) {
      return;
    }

    try {
      const tableName = type === 'bounty' ? 'bounty_submissions' : 'grant_submissions';
      
      const { error } = await supabase
        .from(tableName)
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      if (error) throw error;

      // Refresh submissions
      await fetchAllSubmissions();
    } catch (err) {
      console.error('Error rejecting submission:', err);
      setError(err instanceof Error ? err.message : 'Failed to reject submission');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const toggleExpanded = (submissionId: string) => {
    setExpandedSubmissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(submissionId)) {
        newSet.delete(submissionId);
      } else {
        newSet.add(submissionId);
      }
      return newSet;
    });
  };

  const isExpanded = (submissionId: string) => expandedSubmissions.has(submissionId);

  const filteredSubmissions = submissions.filter(sub => {
    const matchesFilter = filter === 'all' || sub.status === filter;
    const matchesSearch = searchQuery === '' || 
      sub.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.opportunity_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Submission Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by project, opportunity, or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-2/3 pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'pending'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(status)}
                    className={filter === status ? 'bg-green-600 text-white' : ''}
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No submissions found</h3>
              <p>
                {submissions.length === 0 
                  ? "You don't have any submissions yet. Submissions will appear here when users submit work for your bounties or grants."
                  : "No submissions match your current filters."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => {
                const expanded = isExpanded(submission.id);
                const descriptionPreview = submission.description.length > 150 
                  ? submission.description.substring(0, 150) + '...' 
                  : submission.description;

                return (
                  <div key={submission.id} className="border rounded-lg overflow-hidden hover:bg-muted/50 transition-colors">
                    {/* Collapsed Header - Always Visible */}
                    <div 
                      className="p-4 cursor-pointer"
                      onClick={() => toggleExpanded(submission.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            submission.type === 'bounty' ? 'bg-blue-100' : 'bg-purple-100'
                          }`}>
                            {submission.type === 'bounty' ? (
                              <Target className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Briefcase className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-lg">{submission.opportunity_title}</h4>
                              
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <User className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">
                                {submission.profiles?.full_name || submission.profiles?.username || 'Unknown User'}
                                {submission.profiles?.username && (
                                  <span className="ml-1">(@{submission.profiles.username})</span>
                                )}
                              </span>
                            </div>
                            
                            
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                          <Badge className={getStatusColor(submission.status)}>
                            {submission.status === 'approved' && <Trophy className="w-3 h-3 mr-1" />}
                            {submission.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                            {submission.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {submission.status}
                          </Badge>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpanded(submission.id);
                            }}
                            className="p-1 hover:bg-muted rounded transition-colors"
                            aria-label={expanded ? 'Collapse' : 'Expand'}
                          >
                            {expanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <div className="text-xs text-muted-foreground">
                          Submitted: {new Date(submission.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                          {expanded ? 'Click to see less' : 'Click to see more'}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content - Conditionally Rendered */}
                    {expanded && (
                      <div className="px-4 pb-4 border-t bg-muted/30" onClick={(e) => e.stopPropagation()}>
                        <div className="pt-4 space-y-4">
                          <div>
                            <h5 className="font-medium mb-2">Project Name:</h5>
                            <div className="bg-muted p-3 rounded-lg">
                              <p className="font-medium">{submission.project_name}</p>
                            </div>
                          </div>
                          
                          {submission.project_url && (
                            <div>
                              <h5 className="font-medium mb-2">Project URL:</h5>
                              <div className="bg-muted p-3 rounded-lg">
                                <a 
                                  href={submission.project_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline break-all"
                                >
                                  {submission.project_url}
                                </a>
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <h5 className="font-medium mb-2">Description:</h5>
                            <div className="bg-muted p-3 rounded-lg">
                              <p className="whitespace-pre-wrap text-sm">{submission.description}</p>
                            </div>
                          </div>

                          {submission.attachments && submission.attachments.length > 0 && (
                            <div>
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

                          <div className="flex items-center justify-end gap-2 pt-3 border-t">
                            {submission.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleSelectWinner(submission.id, submission.type)}
                                  disabled={selectingWinner === submission.id}
                                >
                                  {selectingWinner === submission.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                      Selecting...
                                    </>
                                  ) : (
                                    <>
                                      <Award className="w-4 h-4 mr-1" />
                                      Select Winner
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-500 border-red-500 hover:bg-red-50"
                                  onClick={() => handleRejectSubmission(submission.id, submission.type)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {submission.status === 'approved' && (
                              <div className="flex items-center gap-2 text-green-600">
                                <Trophy className="w-4 h-4" />
                                <span className="font-medium">Winner Selected</span>
                              </div>
                            )}
                            {submission.status === 'rejected' && (
                              <div className="flex items-center gap-2 text-red-600">
                                <XCircle className="w-4 h-4" />
                                <span className="font-medium">Rejected</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionManagement;


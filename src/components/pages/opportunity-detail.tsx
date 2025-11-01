import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../nav-bar";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Award, Calendar, CheckCircle, Clock, DollarSign, Mail, MessageCircle, Zap, FileText } from "lucide-react";
import { getOpportunityById, listOpportunities, Opportunity } from "../../lib/opportunities";
import { useUser } from "../../contexts/UserContext";
import { listSubmissionsForOpportunity, createBountySubmission, createGrantSubmission, checkUserBountySubmission, checkUserGrantSubmission } from "../../lib/submissions";
import { createCommentForOpportunity, listCommentsForOpportunity, OpportunityComment } from "../../lib/comments";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const OpportunityDetailPage = () => {
  const { id } = useParams();
  const location = useLocation() as any;
  const navigate = useNavigate();
  const { user } = useUser();

  const initialFromState: Partial<Opportunity> | undefined = location?.state?.opportunity;

  const [opportunity, setOpportunity] = useState<Partial<Opportunity> | null>(initialFromState ?? null);
  const [loading, setLoading] = useState<boolean>(!initialFromState);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>("");
  const [proposal, setProposal] = useState<string>("");
  const [links, setLinks] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [submissionCount, setSubmissionCount] = useState<number>(0);
  const [userHasSubmitted, setUserHasSubmitted] = useState<boolean>(false);
  const [userSubmissionStatus, setUserSubmissionStatus] = useState<string>("");
  const [related, setRelated] = useState<Partial<Opportunity>[]>([]);
  const [comments, setComments] = useState<OpportunityComment[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [posting, setPosting] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const isSupabaseConfigured = useMemo(() => {
    return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (!id || !isSupabaseConfigured || initialFromState) {
        setLoading(false);
        return;
      }
      setLoading(true); 
      const { data } = await getOpportunityById(id);
      setOpportunity(data ?? null);
      setLoading(false);
    };
    fetch();
  }, [id, isSupabaseConfigured, initialFromState]);

  useEffect(() => {
    const loadCount = async () => {
      if (!id || !isSupabaseConfigured || !opportunity) return;
      const { data } = await listSubmissionsForOpportunity(id, opportunity.type);
      setSubmissionCount(data?.length ?? 0);
    };
    loadCount();
  }, [id, isSupabaseConfigured, opportunity]);

  // Check if user has already submitted
  useEffect(() => {
    const checkUserSubmission = async () => {
      if (!id || !user?.id || !opportunity || !isSupabaseConfigured) {
        setUserHasSubmitted(false);
        setUserSubmissionStatus("");
        return;
      }
      
      try {
        let result;
        if (opportunity.type === "Grant") {
          result = await checkUserGrantSubmission(id, user.id);
        } else {
          result = await checkUserBountySubmission(id, user.id);
        }
        
        if (result.data) {
          setUserHasSubmitted(true);
          setUserSubmissionStatus(result.data.status);
        } else {
          setUserHasSubmitted(false);
          setUserSubmissionStatus("");
        }
      } catch (error) {
        console.error("Error checking user submission:", error);
        setUserHasSubmitted(false);
        setUserSubmissionStatus("");
      }
    };
    
    checkUserSubmission();
  }, [id, user?.id, opportunity, isSupabaseConfigured]);

  useEffect(() => {
    const loadRelated = async () => {
      if (!isSupabaseConfigured) return;
      const { data } = await listOpportunities();
      if (!data || !opportunity) return;
      const sameCategory = data.filter((o: Opportunity) => {
        if (id && String(o.id) === String(id)) return false;
        if (opportunity.category && o.category === opportunity.category) return true;
        return o.type === opportunity.type;
      });
      setRelated(sameCategory.slice(0, 3));
    };
    loadRelated();
  }, [isSupabaseConfigured, opportunity, id]);

  // Load comments
  useEffect(() => {
    const loadComments = async () => {
      if (!id || !isSupabaseConfigured) return;
      const { data } = await listCommentsForOpportunity(id);
      setComments(data || []);
    };
    loadComments();
  }, [id, isSupabaseConfigured]);

  // Countdown for remaining time if deadline exists
  useEffect(() => {
    const deadlineStr = (opportunity as any)?.deadline as string | undefined;
    if (!deadlineStr) {
      setTimeLeft("");
      return;
    }
    const deadline = new Date(deadlineStr).getTime();
    const update = () => {
      const now = Date.now();
      const diff = deadline - now;
      if (diff <= 0) {
        setTimeLeft("Ended");
        return;
      }
      const minutes = Math.floor(diff / (1000 * 60)) % 60;
      const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const parts = [] as string[];
      if (days) parts.push(`${days}d`);
      parts.push(`${hours.toString().padStart(2, '0')}h:${minutes
        .toString()
        .padStart(2, '0')}m`);
      setTimeLeft(parts.join(" "));
    };
    update();
    const idInt = setInterval(update, 1000);
    return () => clearInterval(idInt);
  }, [opportunity]);

  const handlePostComment = async () => {
    if (!user) {
      navigate("/auth?mode=login");
      return;
    }
    if (!id) return;
    const text = commentText.trim();
    if (!text) return;
    setPosting(true);
    try {
      const { data, error } = await createCommentForOpportunity({
        opportunity_id: id,
        user_id: user.id,
        content: text,
      });
      if (error) throw error;
      if (data) setComments((prev) => [data, ...prev]);
      setCommentText("");
    } catch (e) {
      // Best-effort; errors can be surfaced via toast system later
    } finally {
      setPosting(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMsg("");
    if (!user) {
      navigate("/auth?mode=login");
      return;
    }
    if (!id || !opportunity) return;
    
    // Check if user has already submitted
    if (userHasSubmitted) {
      setError("You have already submitted to this opportunity.");
      return;
    }
    
    if (!projectName.trim()) {
      setError("Please provide a project name.");
      return;
    }
    if (!proposal.trim()) {
      setError("Please provide a brief proposal.");
      return;
    }
    setSubmitLoading(true);
    try {
      let result;
      
      // Determine submission type based on opportunity type
      if (opportunity.type === "Grant") {
        result = await createGrantSubmission({
          grant_id: id,
          user_id: user.id,
          project_name: projectName.trim(),
          project_url: links.trim() || null,
          description: proposal.trim(),
          attachments: null, // Can be enhanced later for file uploads
        });
      } else {
        // For Bounty and RFP, use bounty submission
        result = await createBountySubmission({
          bounty_id: id,
          user_id: user.id,
          project_name: projectName.trim(),
          project_url: links.trim() || null,
          description: proposal.trim(),
          attachments: null, // Can be enhanced later for file uploads
        });
      }
      
      if (result.error) {
        // Handle unique constraint violation
        if (result.error.message.includes("duplicate key") || result.error.message.includes("unique constraint")) {
          setError("You have already submitted to this opportunity.");
          setUserHasSubmitted(true);
          setUserSubmissionStatus("pending");
        } else {
          throw result.error;
        }
      } else {
        setSuccessMsg("Submission received. We'll notify the sponsor.");
        setProjectName("");
        setProposal("");
        setLinks("");
        setUserHasSubmitted(true);
        setUserSubmissionStatus("pending");
        
        // Reload submission count to ensure accuracy
        const { data } = await listSubmissionsForOpportunity(id, opportunity.type);
        setSubmissionCount(data?.length ?? 0);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-5xl mx-auto p-6">Loading...</div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-5xl mx-auto p-6">Opportunity not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="mb-4">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-primary">← Back</button>
        </div>

       

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border border-border p-4 sm:p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-xl sm:text-2xl font-bold truncate">{opportunity.title}</h1>
                {opportunity?.status === "Active" && <CheckCircle className="w-5 h-5 text-green-400" />}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {opportunity.type && (
                  <span className="flex items-center gap-1">
                    {opportunity.type === "Bounty" ? <Zap className="w-4 h-4" /> : 
                     opportunity.type === "RFP" ? <FileText className="w-4 h-4" /> : 
                     <Award className="w-4 h-4" />}
                    {opportunity.type}
                  </span>
                )}
                {opportunity.reward && (
                  <span className="text-green-400">{opportunity.reward}</span>
                )}
                {opportunity.max_amount && (
                  <span className="flex items-center gap-1 text-green-400"><DollarSign className="w-4 h-4" />{opportunity.max_amount}</span>
                )}
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-2">
              {timeLeft && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{timeLeft} remaining</span>
                </div>
              )}
              {submissionCount >= 0 && (
                <div className="text-xs sm:text-sm text-muted-foreground">{submissionCount} submissions</div>
              )}
            </div>
          </div>

          <div className="mt-4 text-muted-foreground text-sm sm:text-base whitespace-pre-wrap">
            {opportunity.type === "RFP" && (opportunity as any)?.fullDescription ? (
              <>
                {isExpanded ? (opportunity as any).fullDescription : opportunity.description}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-2 text-green-400 hover:text-green-300 text-sm font-medium"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              </>
            ) : (
              opportunity.description || "No description provided."
            )}
          </div>

          {/* Skills Needed */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">Skills needed</h3>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const category = (opportunity.category || "").toLowerCase();
                const provided = (opportunity as any)?.skills as string[] | undefined;
                const defaults: Record<string, string[]> = {
                  development: ["TypeScript", "React", "APIs"],
                  design: ["Figma", "UI/UX", "Prototyping"],
                  content: ["Technical Writing", "SEO", "Editing"],
                  research: ["Data Analysis", "Literature Review", "Documentation"],
                  events: ["Event Planning", "Logistics", "Coordination"],
                };
                const fallback = ["Communication", "Time management"];
                const skills = provided && provided.length
                  ? provided
                  : (defaults[category] || fallback);
                return skills.map((s, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-muted text-foreground/80 text-xs border border-border">{s}</span>
                ));
              })()}
            </div>
          </div>
        </Card>
            <Card className="bg-card border border-border p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">
                {userHasSubmitted ? "Your Submission Status" : `Submit Your ${opportunity?.type === "Grant" ? "Grant Application" : "Bounty Submission"}`}
              </h2>
              {!user && (
                <div className="mb-4 text-sm text-muted-foreground">
                  You need to be logged in to submit. <button className="text-green-400" onClick={() => navigate("/auth?mode=login")}>Login</button>
                </div>
              )}
              
              {user && userHasSubmitted ? (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium">Submission Status: </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        userSubmissionStatus === 'approved' ? 'bg-green-100 text-green-800' :
                        userSubmissionStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {userSubmissionStatus.charAt(0).toUpperCase() + userSubmissionStatus.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You have already submitted to this {opportunity?.type === "Grant" ? "grant" : "bounty"}. 
                      {userSubmissionStatus === 'pending' && " The sponsor will review your submission and notify you of the decision."}
                      {userSubmissionStatus === 'approved' && " Congratulations! Your submission has been approved."}
                      {userSubmissionStatus === 'rejected' && " Unfortunately, your submission was not selected this time."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-foreground mb-2">Project Name *</label>
                    <input
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full bg-background text-foreground border border-border rounded-lg p-3 focus:ring-2 focus:ring-ring focus:border-transparent"
                      placeholder={opportunity?.type === "Grant" ? "Enter your project name" : "Enter your project name"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      {opportunity?.type === "Grant" ? "Project Proposal" :  "Description/ Additional Notes"}
                    </label>
                    <textarea
                      value={proposal}
                      onChange={(e) => setProposal(e.target.value)}
                      className="w-full bg-background text-foreground border border-border rounded-lg p-3 min-h-[120px] focus:ring-2 focus:ring-ring focus:border-transparent"
                      placeholder={
                        opportunity?.type === "Grant" 
                          ? "Describe your project goals, timeline, and expected outcomes. Include team information and milestones."
                          : "Description/ Additional Notes (Optional)"
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-foreground mb-2">Links (optional)</label>
                    <input
                      value={links}
                      onChange={(e) => setLinks(e.target.value)}
                      className="w-full bg-background text-foreground border border-border rounded-lg p-3 focus:ring-2 focus:ring-ring focus:border-transparent"
                      placeholder={
                        opportunity?.type === "Grant" 
                          ? "GitHub, portfolio, demo links, team profiles (comma separated)"
                          : "GitHub, portfolio, demo links (comma separated)"
                      }
                    />
                  </div>
                  {error && <div className="text-destructive text-sm">{error}</div>}
                  {successMsg && <div className="text-green-400 text-sm">{successMsg}</div>}
                  <div className="flex justify-end">
                    <Button onClick={handleSubmit} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white" disabled={submitLoading}>
                      {submitLoading ? "Submitting..." : `Submit ${opportunity?.type === "Grant" ? "Application" : "Submission"}`}
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Comments Section */}
            <Card className="bg-card border border-border p-4 sm:p-6">
              <h3 className="font-semibold mb-4">Comments</h3>
              {user ? (
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={(user as any)?.user_metadata?.avatar_url || (user as any)?.user_metadata?.picture || ""} />
                    <AvatarFallback className="bg-green-700 text-white">
                      {(user?.email || "U").slice(0,2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full bg-background text-foreground border border-border rounded-lg p-3 min-h-[80px] focus:ring-2 focus:ring-ring focus:border-transparent"
                      placeholder="Share feedback, ask questions, or drop your submission link"
                    />
                    <div className="flex justify-end mt-2">
                      <Button onClick={handlePostComment} disabled={posting || !commentText.trim()} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600">
                        {posting ? "Posting..." : "Post"}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground mb-4">Login to join the discussion.</div>
              )}

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No comments yet.</div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-muted text-foreground">U</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm text-foreground whitespace-pre-wrap">{c.content}</div>
                        <div className="text-xs text-muted-foreground mt-1">{new Date(c.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Related Listings (shown below on mobile, sidebar on desktop) */}
            <div className="lg:hidden">
              <Card className="bg-card border border-border p-4 sm:p-6">
                <h3 className="font-semibold mb-4">Related Live listings</h3>
                {related.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No related listings yet.</div>
                ) : (
                  <div className="space-y-3">
                    {related.map((r) => (
                      <Link key={String(r.id)} to={`/opportunity/${r.id}`} state={{ opportunity: r }} className="block">
                        <div className="p-3 rounded-lg bg-muted/60 border border-border hover:border-green-600 transition-colors">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm text-foreground truncate">{r.title}</div>
                              <div className="text-xs text-muted-foreground truncate">{r.type}{r.category ? ` • ${r.category}` : ""}</div>
                            </div>
                            {r.reward && <div className="text-xs text-green-400 whitespace-nowrap">{r.reward}</div>}
                            {!r.reward && r.max_amount && (
                              <div className="text-xs text-green-400 whitespace-nowrap">{r.max_amount}</div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-card border border-border p-4 sm:p-6">
              <h3 className="font-semibold mb-2">Opportunity details</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <span className={opportunity.status === "Active" ? "text-green-400" : "text-muted-foreground"}>{opportunity.status}</span>
                </div>
                {opportunity.category && (
                  <div className="flex items-center justify-between">
                    <span>Category</span>
                    <span className="text-muted-foreground">{opportunity.category}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Submissions</span>
                  <span className="text-muted-foreground flex items-center gap-1"><MessageCircle className="w-4 h-4" />{submissionCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Winner announcement</span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {(opportunity as any)?.announce_by || "TBA"}
                  </span>
                </div>
              </div>
            </Card>

            {/* Prizes Card */}
            <Card className="bg-card border border-border p-4 sm:p-6">
              <h3 className="font-semibold mb-2">Prizes</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <span className="flex items-center gap-1"><h3>Total: {opportunity.reward}</h3></span>
                
                {(() => {
                  const prizes = (opportunity as any)?.prizes as { label: string; amount: string }[] | undefined;
                  const defaults = prizes && prizes.length ? prizes : [
                    { label: "1st", amount: (opportunity as any)?.first_prize || "" },
                    { label: "2nd", amount: (opportunity as any)?.second_prize || "" },
                    { label: "3rd", amount: (opportunity as any)?.third_prize || "" },
                  ].filter(p => p.amount);
                  if (!defaults || defaults.length === 0) {
                    return <div className="text-xs text-muted-foreground">Prize information will be provided by the sponsor.</div>;
                  }
                  return (
                    <ul className="space-y-2">
                      {defaults.map((p, i) => (
                        <li key={i} className="flex items-center justify-between">
                          <span className="text-muted-foreground">{p.label}</span>
                          <span className="text-green-400">{p.amount}</span>
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            </Card>

            <Card className="bg-card border border-border p-4 sm:p-6">
              <h3 className="font-semibold mb-2">Contact organizers</h3>
              <div className="text-sm text-muted-foreground mb-4">Have questions or need clarification? Reach out to the organizers.</div>
              <Button
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 flex items-center gap-2 justify-center text-white"
                onClick={() => {
                  const email = (opportunity as any)?.contact_email || "support@peersurf.xyz";
                  const subject = encodeURIComponent(`Opportunity Inquiry: ${opportunity.title}`);
                  const body = encodeURIComponent("Hi,\n\nI have a question regarding this opportunity.\n\nThanks,");
                  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
                }}
              >
                <Mail className="w-4 h-4" /> Contact Sponsor
              </Button>
            </Card>

            <div className="hidden lg:block">
              <Card className="bg-card border border-border p-4 sm:p-6">
                <h3 className="font-semibold mb-4">Related Live listings</h3>
                {related.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No related listings yet.</div>
                ) : (
                  <div className="space-y-3">
                    {related.map((r) => (
                      <Link key={String(r.id)} to={`/opportunity/${r.id}`} state={{ opportunity: r }} className="block">
                        <div className="p-3 rounded-lg bg-muted/60 border border-border hover:border-green-600 transition-colors">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm text-foreground truncate">{r.title}</div>
                              <div className="text-xs text-muted-foreground truncate">{r.type}{r.category ? ` • ${r.category}` : ""}</div>
                            </div>
                            {r.reward && <div className="text-xs text-green-400 whitespace-nowrap">{r.reward}</div>}
                            {!r.reward && r.max_amount && (
                              <div className="text-xs text-green-400 whitespace-nowrap">{r.max_amount}</div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetailPage;



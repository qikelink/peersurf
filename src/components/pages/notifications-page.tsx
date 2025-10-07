import React from "react";
import EmptyState from "../ui/empty-state";
import { ArrowLeft, Bell, CheckCircle2, Info, Link2, Trash2 } from "lucide-react";
import ActionButtons from "../ui/action-buttons";
import { useNotifications } from "../../contexts/NotificationsContext";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import Navbar from "../nav-bar";
import { Skeleton } from "../ui/skeleton";

const NotificationsPage: React.FC = () => {
  const { notifications, loading, refreshNotifications } = useNotifications();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Navbar />
      <div className="flex items-center gap-3 px-4 pt-8 pb-4">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="font-semibold text-lg">Notifications</div>
          <div className="text-xs text-muted-foreground">All your recent activity and alerts</div>
        </div>
        <Button onClick={refreshNotifications} variant="outline" className="border-border text-foreground hover:bg-muted">
          Refresh
        </Button>
      </div>
      <div className="flex-1 px-4 py-6">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={`notif-skel-${i}`} className="bg-card border border-border p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState 
            message="No notifications yet." 
            icon={<Info />} 
          >
            <div className="text-sm text-muted-foreground">
              You'll see notifications here when you have activity on your account.
            </div>
          </EmptyState>
        ) : (
          <div className="space-y-4">
            {notifications.map((n: any) => (
              <Card key={n.id} className="bg-card border border-border p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {n.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : n.type === 'info' ? (
                      <Bell className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Info className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm mb-1 truncate">{n.title}</div>
                    {n.link ? (
                      <a href={n.link} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                        <Link2 className="w-3 h-3" /> View details
                      </a>
                    ) : (
                      <div className="text-xs text-muted-foreground mb-1 truncate">{n.message}</div>
                    )}
                    <div className="text-xs text-muted-foreground">{n.timestamp}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Placeholder for dismiss action if supported */}
                    <button title="Dismiss" className="p-2 rounded-sm hover:bg-muted">
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Action Buttons - Fixed at bottom */}
      <ActionButtons />
    </div>
  );
};

export default NotificationsPage; 
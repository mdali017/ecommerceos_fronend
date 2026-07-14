"use client";

import Link from "next/link";
import {
  useListNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/app/redux/services/notificationApi";
import { useLocale } from "@/components/providers/LocaleProvider";
import { formatDashboardDateTime } from "@/lib/i18n/product-display";

export function NotificationsContent() {
  const { dictionary, locale } = useLocale();
  const t = dictionary.dashboard;
  const { data: notifications = [], isLoading, isError, refetch } = useListNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = async (id: string) => {
    try {
      await markRead(id).unwrap();
    } catch {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
    } catch {
      // ignore
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-brand-border bg-card p-8 text-center text-sm text-muted">
        {t.notificationsLoading}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-brand-border bg-card p-8 text-center text-sm text-red-600">
        {t.notificationsLoadError}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">{t.notificationsTitle}</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-brand-orange">
              {t.unread.replace("{count}", String(unreadCount))}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-foreground"
          >
            {t.refresh}
          </button>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => void handleMarkAllRead()}
              className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white"
            >
              {t.markAllRead}
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-card p-8 text-center text-muted">
          {t.noNotifications}
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const content = (
              <div
                className={`rounded-2xl border p-4 transition-colors ${
                  notification.isRead
                    ? "border-brand-border bg-card"
                    : "border-brand-orange/30 bg-orange-50 dark:bg-orange-950/20"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-foreground">{notification.title}</p>
                    <p className="mt-1 text-sm text-muted">{notification.message}</p>
                    <p className="mt-2 text-xs text-muted/70">
                      {formatDashboardDateTime(notification.createdAt, locale)}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        void handleMarkRead(notification.id);
                      }}
                      className="rounded-lg border border-brand-border px-3 py-1 text-xs font-semibold text-foreground"
                    >
                      {t.read}
                    </button>
                  )}
                </div>
              </div>
            );

            if (notification.link) {
              return (
                <Link
                  key={notification.id}
                  href={notification.link}
                  onClick={() => {
                    if (!notification.isRead) void handleMarkRead(notification.id);
                  }}
                >
                  {content}
                </Link>
              );
            }

            return <div key={notification.id}>{content}</div>;
          })}
        </div>
      )}
    </div>
  );
}

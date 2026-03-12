"use client";

import { useState, useMemo } from "react";
import { MessageSquare, Plus, Send, Clock, ChevronDown, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { SearchInput } from "@/components/shared/search-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// --- Types ---
interface ThreadMessage {
  id: string;
  sender: string;
  senderRole: "admin" | "supplier";
  body: string;
  time: string;
}

interface Thread {
  id: string;
  subject: string;
  entityType: "allocation" | "delivery" | "order" | null;
  lastMessagePreview: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ThreadMessage[];
}

// --- Mock data ---
const mockThreads: Thread[] = [
  {
    id: "t1",
    subject: "Phân bổ T03/2026 - Nấm rơm",
    entityType: "allocation",
    lastMessagePreview: "Xin xác nhận lại lịch giao hàng tuần tới cho đợt nấm rơm",
    lastMessageTime: "10 phút trước",
    unreadCount: 1,
    messages: [
      { id: "m1", sender: "Phạm Thị Lan", senderRole: "admin", body: "Chào NCC ABC, kế hoạch phân bổ T03 đã được gửi. Vui lòng xem và phản hồi trước ngày 15/03.", time: "2026-03-10 10:00" },
      { id: "m2", sender: "Bạn", senderRole: "supplier", body: "Tôi đã xem. Nấm rơm L1 OK, nhưng L2 cần giảm 30kg do thời tiết.", time: "2026-03-11 08:30" },
      { id: "m3", sender: "Phạm Thị Lan", senderRole: "admin", body: "Xin xác nhận lại lịch giao hàng tuần tới cho đợt nấm rơm. Chúng tôi cần biết chính xác ngày giao.", time: "2026-03-12 09:50" },
    ],
  },
  {
    id: "t2",
    subject: "Kết quả QC - Giao hàng 09/03",
    entityType: "delivery",
    lastMessagePreview: "Kế hoạch phân bổ tháng 4 đã sẵn sàng để review",
    lastMessageTime: "2 giờ trước",
    unreadCount: 1,
    messages: [
      { id: "m4", sender: "Hoàng Văn QC", senderRole: "admin", body: "Lô hàng ngày 09/03 bị đánh giá L2 do nhiệt độ vận chuyển > 5°C. Vui lòng kiểm tra lại cold chain.", time: "2026-03-10 14:00" },
      { id: "m5", sender: "Bạn", senderRole: "supplier", body: "Cảm ơn thông tin. Chúng tôi đã kiểm tra và thay đổi đơn vị vận chuyển để đảm bảo cold chain.", time: "2026-03-10 16:00" },
    ],
  },
  {
    id: "t3",
    subject: "Đăng ký sản phẩm mới - Nấm kim châm",
    entityType: null,
    lastMessagePreview: "Hồ sơ đang được xét duyệt, vui lòng chờ",
    lastMessageTime: "1 ngày trước",
    unreadCount: 0,
    messages: [
      { id: "m6", sender: "Bạn", senderRole: "supplier", body: "Chúng tôi muốn đăng ký thêm sản phẩm Nấm kim châm, năng lực 200kg/tháng, L1.", time: "2026-03-09 10:00" },
      { id: "m7", sender: "Nguyễn Văn Admin", senderRole: "admin", body: "Đã nhận. Hồ sơ đang được xét duyệt, vui lòng chờ khoảng 3-5 ngày làm việc.", time: "2026-03-09 14:00" },
    ],
  },
  {
    id: "t4",
    subject: "Thông báo: Lịch nghỉ lễ 30/4",
    entityType: null,
    lastMessagePreview: "Thông báo lịch nghỉ lễ và giao hàng dịp 30/4",
    lastMessageTime: "3 ngày trước",
    unreadCount: 0,
    messages: [
      { id: "m8", sender: "Nguyễn Văn Admin", senderRole: "admin", body: "Thông báo: Dịp 30/4 - 1/5 công ty sẽ nghỉ 4 ngày. Vui lòng lên kế hoạch giao hàng trước ngày 28/4.", time: "2026-03-08 09:00" },
    ],
  },
];

const entityBadgeMap: Record<string, { label: string; variant: "info" | "success" | "warning" }> = {
  allocation: { label: "Phân bổ", variant: "info" },
  delivery: { label: "Giao hàng", variant: "success" },
  order: { label: "Đơn hàng", variant: "warning" },
};

export default function SupplierMessagesPage() {
  const [search, setSearch] = useState("");
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const filteredThreads = useMemo(() => {
    if (!search) return mockThreads;
    const lower = search.toLowerCase();
    return mockThreads.filter(
      (t) =>
        t.subject.toLowerCase().includes(lower) ||
        t.lastMessagePreview.toLowerCase().includes(lower),
    );
  }, [search]);

  const toggleThread = (threadId: string) => {
    setExpandedThread((prev) => (prev === threadId ? null : threadId));
    setReplyText("");
  };

  const handleReply = (threadId: string) => {
    if (!replyText.trim()) return;
    alert(`Đã gửi tin nhắn cho thread ${threadId}: "${replyText}"`);
    setReplyText("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tin nhắn"
        description="Trao đổi với bộ phận thu mua"
        breadcrumbs={[
          { label: "Dashboard", href: "/supplier" },
          { label: "Tin nhắn" },
        ]}
        actions={
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-1" />
            Tin nhắn mới
          </Button>
        }
      />

      {/* Search */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Tìm kiếm tin nhắn..."
        className="max-w-md"
      />

      {/* Thread list */}
      <div className="space-y-2">
        {filteredThreads.map((thread) => {
          const isExpanded = expandedThread === thread.id;
          return (
            <Card key={thread.id} className={isExpanded ? "border-teal-200" : ""}>
              {/* Thread header - clickable */}
              <div
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleThread(thread.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span className={`text-sm font-medium truncate ${thread.unreadCount > 0 ? "font-bold" : ""}`}>
                        {thread.subject}
                      </span>
                      {thread.entityType && entityBadgeMap[thread.entityType] && (
                        <StatusBadge
                          label={entityBadgeMap[thread.entityType].label}
                          variant={entityBadgeMap[thread.entityType].variant}
                        />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate ml-6">
                      {thread.lastMessagePreview}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {thread.lastMessageTime}
                    </span>
                    {thread.unreadCount > 0 && (
                      <Badge className="bg-teal-600 text-white text-xs px-1.5 py-0.5 min-w-[20px] text-center">
                        {thread.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded messages */}
              {isExpanded && (
                <>
                  <Separator />
                  <CardContent className="p-4 space-y-3">
                    {thread.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-lg ${
                          msg.senderRole === "supplier"
                            ? "bg-teal-50 border border-teal-100 ml-8"
                            : "bg-gray-50 border border-gray-100 mr-8"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">
                            {msg.sender}
                          </span>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <p className="text-sm">{msg.body}</p>
                      </div>
                    ))}

                    {/* Reply input */}
                    <div className="flex gap-2 mt-3">
                      <Input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleReply(thread.id);
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleReply(thread.id)}
                        disabled={!replyText.trim()}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          );
        })}

        {filteredThreads.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Không tìm thấy tin nhắn nào</p>
          </div>
        )}
      </div>
    </div>
  );
}

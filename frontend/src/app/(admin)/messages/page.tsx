"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Plus,
  Send,
  Paperclip,
  Clock,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Inline mock data ---
interface MockMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "admin" | "supplier";
  body: string;
  createdAt: string;
}

interface MockThread {
  id: string;
  subject: string;
  supplierName: string;
  supplierCode: string;
  entityType: "allocation" | "delivery" | "order" | null;
  entityLabel: string | null;
  status: "open" | "closed";
  lastMessagePreview: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: MockMessage[];
}

const mockThreads: MockThread[] = [
  {
    id: "t1",
    subject: "Xác nhận phân bổ Nấm rơm T3/2026",
    supplierName: "Trang trại ABC",
    supplierCode: "NCC-001",
    entityType: "allocation",
    entityLabel: "PB-2026-03",
    status: "open",
    lastMessagePreview: "Bên em xác nhận được 250kg/tuần cho tháng 3 nhé.",
    lastMessageAt: "2026-03-12T09:30:00Z",
    unreadCount: 2,
    messages: [
      { id: "m1", senderId: "u4", senderName: "Phạm Thị Lan", senderRole: "admin", body: "Chào anh A, bên mình cần xác nhận khối lượng phân bổ Nấm rơm cho T3/2026. Kế hoạch là 300kg/tuần, anh có đáp ứng được không ạ?", createdAt: "2026-03-10T14:00:00Z" },
      { id: "m2", senderId: "u8", senderName: "Nguyễn A (TT ABC)", senderRole: "supplier", body: "Chào chị Lan, do thời tiết tháng này, bên em chỉ đáp ứng được khoảng 250kg/tuần thôi ạ. Mong bên chị thông cảm.", createdAt: "2026-03-11T08:30:00Z" },
      { id: "m3", senderId: "u4", senderName: "Phạm Thị Lan", senderRole: "admin", body: "Vậy em điều chỉnh kế hoạch nhé. 250kg/tuần, bắt đầu từ tuần tới. Anh xác nhận giúp em.", createdAt: "2026-03-11T10:00:00Z" },
      { id: "m4", senderId: "u8", senderName: "Nguyễn A (TT ABC)", senderRole: "supplier", body: "Bên em xác nhận được 250kg/tuần cho tháng 3 nhé.", createdAt: "2026-03-12T09:30:00Z" },
    ],
  },
  {
    id: "t2",
    subject: "Giao hàng trễ - Đơn DH-0038",
    supplierName: "HTX Nấm Củ Chi",
    supplierCode: "NCC-002",
    entityType: "delivery",
    entityLabel: "DH-0038",
    status: "open",
    lastMessagePreview: "Xe bị hỏng trên đường, dự kiến trễ 3 tiếng ạ.",
    lastMessageAt: "2026-03-12T07:15:00Z",
    unreadCount: 1,
    messages: [
      { id: "m5", senderId: "u8", senderName: "Trần Thị B (HTX)", senderRole: "supplier", body: "Chào bên Nấm Xanh, xe giao hàng bị hỏng trên đường. Bên em đang điều xe mới. Dự kiến trễ khoảng 3 tiếng ạ.", createdAt: "2026-03-12T06:00:00Z" },
      { id: "m6", senderId: "u4", senderName: "Phạm Thị Lan", senderRole: "admin", body: "Cảm ơn chị đã thông báo. Chị cập nhật khi xe mới xuất phát nhé.", createdAt: "2026-03-12T06:15:00Z" },
      { id: "m7", senderId: "u8", senderName: "Trần Thị B (HTX)", senderRole: "supplier", body: "Xe bị hỏng trên đường, dự kiến trễ 3 tiếng ạ.", createdAt: "2026-03-12T07:15:00Z" },
    ],
  },
  {
    id: "t3",
    subject: "Chất lượng Nấm đùi gà - Phản hồi QC",
    supplierName: "Farm Đà Lạt Green",
    supplierCode: "NCC-003",
    entityType: "delivery",
    entityLabel: "GH-0091",
    status: "closed",
    lastMessagePreview: "Đã cải thiện quy trình đóng gói. Cảm ơn đã phản hồi.",
    lastMessageAt: "2026-03-08T16:00:00Z",
    unreadCount: 0,
    messages: [
      { id: "m8", senderId: "u5", senderName: "Hoàng Văn QC", senderRole: "admin", body: "Lô hàng GH-0091 bị giảm cấp từ L1 xuống L2 do kích thước không đồng đều. Nhờ bên anh kiểm tra lại quy trình phân loại.", createdAt: "2026-03-07T10:00:00Z" },
      { id: "m9", senderId: "u8", senderName: "Lê Văn C (Farm)", senderRole: "supplier", body: "Đã cải thiện quy trình đóng gói. Cảm ơn đã phản hồi.", createdAt: "2026-03-08T16:00:00Z" },
    ],
  },
  {
    id: "t4",
    subject: "Báo giá Nấm kim châm Q2/2026",
    supplierName: "NCC Phú Yên",
    supplierCode: "NCC-004",
    entityType: "order",
    entityLabel: "BG-Q2",
    status: "open",
    lastMessagePreview: "Giá đề xuất 45,000đ/kg cho L1. Xin phản hồi.",
    lastMessageAt: "2026-03-11T15:00:00Z",
    unreadCount: 0,
    messages: [
      { id: "m10", senderId: "u8", senderName: "Phạm Văn D (Phú Yên)", senderRole: "supplier", body: "Gửi bên Nấm Xanh bảng báo giá Nấm kim châm cho Q2/2026. Giá đề xuất 45,000đ/kg cho L1, 38,000đ/kg cho L2. Xin phản hồi.", createdAt: "2026-03-11T15:00:00Z" },
    ],
  },
];

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date("2026-03-12T10:00:00Z");
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Vừa xong";
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString("vi-VN");
}

const entityTypeLabels: Record<string, { label: string; color: string }> = {
  allocation: { label: "Phân bổ", color: "bg-blue-100 text-blue-800" },
  delivery: { label: "Giao hàng", color: "bg-green-100 text-green-800" },
  order: { label: "Đơn hàng", color: "bg-purple-100 text-purple-800" },
};

export default function MessagesPage() {
  const [search, setSearch] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const filteredThreads = useMemo(() => {
    if (!search) return mockThreads;
    const q = search.toLowerCase();
    return mockThreads.filter(
      (t) =>
        t.subject.toLowerCase().includes(q) ||
        t.supplierName.toLowerCase().includes(q)
    );
  }, [search]);

  const selectedThread = useMemo(
    () => mockThreads.find((t) => t.id === selectedThreadId) ?? null,
    [selectedThreadId]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tin nhắn"
        description="Trao đổi với nhà cung cấp"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Tin nhắn" },
        ]}
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Tin nhắn mới
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border rounded-lg overflow-hidden bg-background min-h-[600px]">
        {/* Left Panel - Thread List */}
        <div className="lg:col-span-1 border-r flex flex-col">
          <div className="p-3 border-b">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Tìm cuộc hội thoại..."
            />
          </div>
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {filteredThreads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={cn(
                    "w-full text-left p-4 hover:bg-muted/50 transition-colors",
                    selectedThreadId === thread.id && "bg-muted"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={cn("text-sm font-medium line-clamp-1", thread.unreadCount > 0 && "font-semibold")}>
                      {thread.subject}
                    </h4>
                    {thread.unreadCount > 0 && (
                      <Badge variant="default" className="shrink-0 text-xs h-5 min-w-[20px] flex items-center justify-center">
                        {thread.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-muted-foreground">{thread.supplierName}</span>
                    {thread.entityType && thread.entityLabel && (
                      <Badge
                        variant="secondary"
                        className={cn("text-[10px] h-4 px-1.5", entityTypeLabels[thread.entityType]?.color)}
                      >
                        {thread.entityLabel}
                      </Badge>
                    )}
                    <StatusBadge
                      label={thread.status === "open" ? "Mở" : "Đóng"}
                      variant={thread.status === "open" ? "success" : "muted"}
                      className="text-[10px] h-4 px-1.5"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground line-clamp-1 flex-1">
                      {thread.lastMessagePreview}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                      {formatTime(thread.lastMessageAt)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Messages */}
        <div className="lg:col-span-2 flex flex-col">
          {selectedThread ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{selectedThread.subject}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {selectedThread.supplierName} ({selectedThread.supplierCode})
                      </span>
                      {selectedThread.entityType && selectedThread.entityLabel && (
                        <Badge
                          variant="secondary"
                          className={cn("text-[10px] h-4 px-1.5", entityTypeLabels[selectedThread.entityType]?.color)}
                        >
                          {entityTypeLabels[selectedThread.entityType]?.label}: {selectedThread.entityLabel}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <StatusBadge
                    label={selectedThread.status === "open" ? "Đang mở" : "Đã đóng"}
                    variant={selectedThread.status === "open" ? "success" : "muted"}
                  />
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedThread.messages.map((msg) => {
                    const isAdmin = msg.senderRole === "admin";
                    return (
                      <div
                        key={msg.id}
                        className={cn("flex", isAdmin ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-4 py-3",
                            isAdmin
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted rounded-bl-md"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-3 w-3" />
                            <span className="text-xs font-medium">{msg.senderName}</span>
                          </div>
                          <p className="text-sm leading-relaxed">{msg.body}</p>
                          <div className={cn("flex items-center gap-1 mt-2", isAdmin ? "justify-end" : "justify-start")}>
                            <Clock className="h-3 w-3 opacity-60" />
                            <span className="text-[10px] opacity-60">
                              {formatTime(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Reply Input */}
              {selectedThread.status === "open" && (
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <input
                      type="text"
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button size="icon" className="shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">Chọn cuộc hội thoại</p>
              <p className="text-xs mt-1">Chọn một thread từ danh sách bên trái để xem tin nhắn</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

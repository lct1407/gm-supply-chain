"use client";

import { useState } from "react";
import { Save, AlertCircle, FileText, Download, Building2, MapPin, User, Phone, Mail } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// --- Types ---
interface SupplierProfile {
  businessName: string;
  taxCode: string;
  contactName: string;
  email: string;
  phone: string;
  farmAddress: string;
  farmRegion: string;
  farmArea: string;
}

interface Document {
  id: string;
  type: string;
  name: string;
  uploadedAt: string;
  url: string;
}

// --- Mock data (matching supplier s1) ---
const initialProfile: SupplierProfile = {
  businessName: "Trang trại ABC",
  taxCode: "0123456789",
  contactName: "Nguyễn Văn A",
  email: "abc@farm.vn",
  phone: "0901234567",
  farmAddress: "123 Đường Hoa Hồng, P.8, Đà Lạt, Lâm Đồng",
  farmRegion: "Đà Lạt",
  farmArea: "5.2",
};

const mockDocuments: Document[] = [
  { id: "doc1", type: "GPKD", name: "Giấy phép kinh doanh.pdf", uploadedAt: "2025-01-15", url: "#" },
  { id: "doc2", type: "Chứng nhận ATTP", name: "Chứng nhận ATTP.pdf", uploadedAt: "2025-01-15", url: "#" },
  { id: "doc3", type: "VietGAP", name: "Chứng nhận VietGAP.pdf", uploadedAt: "2025-03-10", url: "#" },
  { id: "doc4", type: "Hợp đồng", name: "Hợp đồng cung ứng 2026.pdf", uploadedAt: "2026-01-01", url: "#" },
];

export default function SupplierProfilePage() {
  const [profile, setProfile] = useState<SupplierProfile>(initialProfile);

  const updateField = (field: keyof SupplierProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert("Thông tin đã được lưu thành công!");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hồ sơ nhà cung cấp"
        description="Quản lý thông tin doanh nghiệp và tài liệu"
        breadcrumbs={[
          { label: "Dashboard", href: "/supplier" },
          { label: "Hồ sơ" },
        ]}
      />

      {/* Admin approval note */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
          <p className="text-sm text-blue-800">
            Thay đổi Tên doanh nghiệp hoặc Mã số thuế cần Admin phê duyệt.
            Các trường khác có thể chỉnh sửa trực tiếp.
          </p>
        </CardContent>
      </Card>

      {/* Profile form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4 text-teal-600" />
            Thông tin doanh nghiệp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Business name - read-only */}
            <div className="space-y-1.5">
              <Label htmlFor="businessName" className="text-sm flex items-center gap-1">
                Tên doanh nghiệp
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500">
                  Chỉ đọc
                </Badge>
              </Label>
              <Input
                id="businessName"
                value={profile.businessName}
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>

            {/* Tax code - read-only */}
            <div className="space-y-1.5">
              <Label htmlFor="taxCode" className="text-sm flex items-center gap-1">
                Mã số thuế
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500">
                  Chỉ đọc
                </Badge>
              </Label>
              <Input
                id="taxCode"
                value={profile.taxCode}
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>

            {/* Contact name */}
            <div className="space-y-1.5">
              <Label htmlFor="contactName" className="text-sm flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Người liên hệ
              </Label>
              <Input
                id="contactName"
                value={profile.contactName}
                onChange={(e) => updateField("contactName", e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                Số điện thoại
              </Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Farm info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-teal-600" />
            Thông tin trang trại
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Farm address */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="farmAddress" className="text-sm">Địa chỉ trại</Label>
              <Input
                id="farmAddress"
                value={profile.farmAddress}
                onChange={(e) => updateField("farmAddress", e.target.value)}
              />
            </div>

            {/* Farm region */}
            <div className="space-y-1.5">
              <Label htmlFor="farmRegion" className="text-sm">Vùng trồng</Label>
              <Input
                id="farmRegion"
                value={profile.farmRegion}
                onChange={(e) => updateField("farmRegion", e.target.value)}
              />
            </div>

            {/* Farm area */}
            <div className="space-y-1.5">
              <Label htmlFor="farmArea" className="text-sm">Diện tích (ha)</Label>
              <Input
                id="farmArea"
                type="number"
                step="0.1"
                value={profile.farmArea}
                onChange={(e) => updateField("farmArea", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
          <Save className="h-4 w-4 mr-2" />
          Lưu thay đổi
        </Button>
      </div>

      <Separator />

      {/* Documents section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-teal-600" />
            Tài liệu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs bg-teal-50 text-teal-700">
                        {doc.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Tải lên: {doc.uploadedAt}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  FileText,
  Package,
  Send,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  { label: "Thông tin DN", icon: Building2 },
  { label: "Sản phẩm", icon: Package },
  { label: "Tài liệu", icon: FileText },
  { label: "Xác nhận", icon: Send },
] as const;

interface ProductOption {
  id: string;
  name: string;
  selected: boolean;
  capacity: string;
}

interface FormData {
  businessName: string;
  taxCode: string;
  contactName: string;
  email: string;
  phone: string;
  farmLocation: string;
  farmArea: string;
  products: ProductOption[];
  gpkdFile: string;
  attpFile: string;
  notes: string;
}

const defaultProducts: ProductOption[] = [
  { id: "nam-rom", name: "Nấm rơm", selected: false, capacity: "" },
  { id: "bao-ngu", name: "Nấm bào ngư", selected: false, capacity: "" },
  { id: "nam-meo", name: "Nấm mèo (mộc nhĩ)", selected: false, capacity: "" },
  { id: "nam-linh-chi", name: "Nấm linh chi", selected: false, capacity: "" },
  { id: "nam-kim-cham", name: "Nấm kim châm", selected: false, capacity: "" },
  { id: "nam-dui-ga", name: "Nấm đùi gà", selected: false, capacity: "" },
  { id: "nam-hong-chi", name: "Nấm hồng chi", selected: false, capacity: "" },
  { id: "nam-sò", name: "Nấm sò", selected: false, capacity: "" },
];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    taxCode: "",
    contactName: "",
    email: "",
    phone: "",
    farmLocation: "",
    farmArea: "",
    products: defaultProducts,
    gpkdFile: "",
    attpFile: "",
    notes: "",
  });

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === productId ? { ...p, selected: !p.selected } : p
      ),
    }));
  };

  const updateProductCapacity = (productId: string, capacity: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === productId ? { ...p, capacity } : p
      ),
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Integrate with registration API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    // TODO: Redirect to success page
  };

  const selectedProducts = formData.products.filter((p) => p.selected);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Đăng ký Nhà cung cấp
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Hoàn thành 4 bước để đăng ký trở thành đối tác Nấm Xanh
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isCompleted = i < step;
          const isCurrent = i === step;
          return (
            <div key={s.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    isCompleted
                      ? "bg-teal-600 border-teal-600 text-white"
                      : isCurrent
                        ? "border-teal-600 text-teal-600 bg-teal-50"
                        : "border-slate-200 text-slate-400 bg-white"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`mt-1.5 text-xs font-medium ${
                    isCurrent
                      ? "text-teal-700"
                      : isCompleted
                        ? "text-teal-600"
                        : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-full mx-2 mt-[-1.25rem] ${
                    isCompleted ? "bg-teal-600" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="min-h-[280px]">
        {/* Step 1: Business info */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-sm font-semibold">
                Tên doanh nghiệp / Trang trại
              </Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => updateField("businessName", e.target.value)}
                placeholder="VD: Trang trại Nấm Sạch Đồng Nai"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxCode" className="text-sm font-semibold">
                  Mã số thuế
                </Label>
                <Input
                  id="taxCode"
                  value={formData.taxCode}
                  onChange={(e) => updateField("taxCode", e.target.value)}
                  placeholder="VD: 0123456789"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farmArea" className="text-sm font-semibold">
                  Diện tích (m&sup2;)
                </Label>
                <Input
                  id="farmArea"
                  type="number"
                  value={formData.farmArea}
                  onChange={(e) => updateField("farmArea", e.target.value)}
                  placeholder="VD: 5000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName" className="text-sm font-semibold">
                Người liên hệ
              </Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => updateField("contactName", e.target.value)}
                placeholder="Họ và tên"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="09xx xxx xxx"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="farmLocation" className="text-sm font-semibold">
                Địa chỉ trang trại
              </Label>
              <Input
                id="farmLocation"
                value={formData.farmLocation}
                onChange={(e) => updateField("farmLocation", e.target.value)}
                placeholder="Số nhà, đường, xã/phường, huyện/quận, tỉnh/TP"
              />
            </div>
          </div>
        )}

        {/* Step 2: Products */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Chọn các loại nấm bạn cung cấp và nhập sản lượng dự kiến (kg/tuần):
            </p>
            <div className="grid gap-3">
              {formData.products.map((product) => (
                <div
                  key={product.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                    product.selected
                      ? "border-teal-200 bg-teal-50/50"
                      : "border-slate-200"
                  }`}
                >
                  <Checkbox
                    id={product.id}
                    checked={product.selected}
                    onCheckedChange={() => toggleProduct(product.id)}
                  />
                  <Label
                    htmlFor={product.id}
                    className="flex-1 text-sm font-medium cursor-pointer"
                  >
                    {product.name}
                  </Label>
                  {product.selected && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={product.capacity}
                        onChange={(e) =>
                          updateProductCapacity(product.id, e.target.value)
                        }
                        className="w-24 h-8 text-sm"
                        placeholder="kg/tuần"
                      />
                      <span className="text-xs text-slate-500">kg/tuần</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Tải lên các tài liệu cần thiết để xác minh doanh nghiệp:
            </p>
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600 shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-semibold text-slate-900">
                        Giấy phép kinh doanh (GPKD)
                      </p>
                      <p className="text-xs text-slate-500">
                        Bản scan hoặc ảnh chụp rõ nét. Định dạng: PDF, JPG, PNG
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        type="button"
                      >
                        <Upload className="h-4 w-4" />
                        Chọn tệp
                      </Button>
                      {formData.gpkdFile && (
                        <p className="text-xs text-teal-600">
                          {formData.gpkdFile}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600 shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-semibold text-slate-900">
                        Chứng nhận An toàn thực phẩm (ATTP)
                      </p>
                      <p className="text-xs text-slate-500">
                        Giấy chứng nhận cơ sở đủ điều kiện ATTP. Định dạng:
                        PDF, JPG, PNG
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        type="button"
                      >
                        <Upload className="h-4 w-4" />
                        Chọn tệp
                      </Button>
                      {formData.attpFile && (
                        <p className="text-xs text-teal-600">
                          {formData.attpFile}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-semibold">
                  Ghi chú thêm (tùy chọn)
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Thông tin bổ sung về trang trại, chứng nhận khác..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Confirm */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Vui lòng kiểm tra lại thông tin trước khi gửi đăng ký:
            </p>

            <Card>
              <CardContent className="pt-4 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Thông tin doanh nghiệp
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-500">Tên DN:</div>
                  <div className="font-medium">
                    {formData.businessName || "—"}
                  </div>
                  <div className="text-slate-500">MST:</div>
                  <div className="font-medium">
                    {formData.taxCode || "—"}
                  </div>
                  <div className="text-slate-500">Liên hệ:</div>
                  <div className="font-medium">
                    {formData.contactName || "—"}
                  </div>
                  <div className="text-slate-500">Email:</div>
                  <div className="font-medium">{formData.email || "—"}</div>
                  <div className="text-slate-500">SĐT:</div>
                  <div className="font-medium">{formData.phone || "—"}</div>
                  <div className="text-slate-500">Địa chỉ:</div>
                  <div className="font-medium">
                    {formData.farmLocation || "—"}
                  </div>
                  <div className="text-slate-500">Diện tích:</div>
                  <div className="font-medium">
                    {formData.farmArea ? `${formData.farmArea} m²` : "—"}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Sản phẩm cung cấp
                </h3>
                {selectedProducts.length > 0 ? (
                  <div className="space-y-1">
                    {selectedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-slate-600">{p.name}</span>
                        <span className="font-medium">
                          {p.capacity ? `${p.capacity} kg/tuần` : "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    Chưa chọn sản phẩm nào
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Tài liệu
                </h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">GPKD:</span>
                    <span
                      className={
                        formData.gpkdFile
                          ? "text-teal-600 font-medium"
                          : "text-amber-500"
                      }
                    >
                      {formData.gpkdFile || "Chưa tải lên"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ATTP:</span>
                    <span
                      className={
                        formData.attpFile
                          ? "text-teal-600 font-medium"
                          : "text-amber-500"
                      }
                    >
                      {formData.attpFile || "Chưa tải lên"}
                    </span>
                  </div>
                </div>
                {formData.notes && (
                  <div>
                    <span className="text-xs text-slate-500">Ghi chú: </span>
                    <span className="text-sm">{formData.notes}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-2">
        {step > 0 ? (
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        ) : (
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Đã có tài khoản? Đăng nhập
          </Link>
        )}

        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
          >
            Tiếp theo
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Đang gửi...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Gửi đăng ký
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

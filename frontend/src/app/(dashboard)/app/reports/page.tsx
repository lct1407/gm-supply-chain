"use client";

import { BarChart3, TrendingUp, Download, PieChart as PieChartIcon, Calendar } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-earth-900 tracking-tight">Báo Cáo & Phân Tích</h2>
          <p className="mt-2 text-earth-600 font-medium">Phân tích chuyên sâu hiệu suất cung ứng và tỷ lệ hỏng hóc.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-5 py-2.5 bg-white border border-earth-200 hover:bg-earth-50 text-earth-700 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Tháng này
           </button>
           <button className="px-5 py-2.5 bg-namxanh-600 hover:bg-namxanh-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-namxanh-600/20 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Xuất PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
         {/* Chart Placeholder 1 */}
         <div className="bg-white p-6 rounded-3xl border border-earth-200/60 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
            <BarChart3 className="w-16 h-16 text-earth-300 mb-4" />
            <h3 className="text-xl font-bold text-earth-900">Sản Lượng Theo Khu Vực</h3>
            <p className="text-earth-500 font-medium mt-2 max-w-sm text-center">Biểu đồ này sẽ thể hiện sản lượng thu hoạch thực tế so với mục tiêu, sử dụng Tremor BarChart.</p>
            <div className="mt-6 px-4 py-2 bg-earth-50 rounded-lg border border-earth-200/50 flex gap-4 text-sm font-semibold text-earth-600">
               <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-namxanh-500"></div> Thực tế</span>
               <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-earth-300"></div> Mục tiêu</span>
            </div>
         </div>

         {/* Chart Placeholder 2 */}
         <div className="bg-white p-6 rounded-3xl border border-earth-200/60 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
            <PieChartIcon className="w-16 h-16 text-earth-300 mb-4" />
            <h3 className="text-xl font-bold text-earth-900">Tỷ Trọng Hỏng Hóc (Waste Rate)</h3>
            <p className="text-earth-500 font-medium mt-2 max-w-sm text-center">Biểu đồ cơ cấu nguyên nhân lỗi: Nhiệt độ, Độ Ẩm, Vận chuyển... sử dụng Recharts PieChart.</p>
            <div className="mt-6 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200/50 flex items-center gap-2 text-sm font-bold">
               <TrendingUp className="w-4 h-4" />
               Tỷ lệ hỏng hóc tháng này: 2.4% (Tốt)
            </div>
         </div>
      </div>

      {/* Data Insight List */}
      <div className="bg-white p-6 rounded-3xl border border-earth-200/60 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
         <h3 className="text-lg font-bold text-earth-900 mb-6">Thông Số Đáng Chú Ý Gần Đây</h3>
         <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-earth-50/50 rounded-2xl border border-earth-100">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                     <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                     <p className="font-bold text-earth-900">Nông Trại Đinh Gia vượt 15% mục tiêu</p>
                     <p className="text-sm font-medium text-earth-500">Do áp dụng thông số độ ẩm 85% tiêu chuẩn mới</p>
                  </div>
               </div>
               <button className="text-sm font-bold text-namxanh-600 hover:text-namxanh-700 transition-colors">Xem chi tiết</button>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-earth-50/50 rounded-2xl border border-earth-100">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                     <BarChart3 className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                     <p className="font-bold text-earth-900">Chi phí vận tải tăng 4% (Khu vực HCM)</p>
                     <p className="text-sm font-medium text-earth-500">Do chạy lạnh liên tục mùa nắng nóng</p>
                  </div>
               </div>
               <button className="text-sm font-bold text-namxanh-600 hover:text-namxanh-700 transition-colors">Xem chi tiết</button>
            </div>
         </div>
      </div>
    </div>
  );
}

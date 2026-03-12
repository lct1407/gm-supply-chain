"use client";

import { Leaf, Thermometer, Droplets, MapPin, Loader2, PieChart } from "lucide-react";
import { OverviewChart } from "@/components/dashboard/OverviewChart";

export default function AppDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-earth-900 tracking-tight">Tổng Quan</h2>
        <p className="mt-2 text-earth-600 font-medium">Theo dõi chuỗi cung ứng Nấm Xanh theo thời gian thực.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Card 1 */}
        <div className="group bg-white p-6 rounded-3xl border border-earth-100 shadow-sm hover:shadow-xl hover:shadow-namxanh-600/5 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-earth-500 group-hover:text-namxanh-600 transition-colors">Năng suất Tồn Kho</h4>
            <div className="p-2 bg-namxanh-50 rounded-xl group-hover:bg-namxanh-100 transition-colors">
              <Leaf className="w-5 h-5 text-namxanh-600" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-earth-900 tracking-tight">8,450</span>
            <span className="text-sm font-medium text-earth-500 mb-1">kg</span>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-600 font-semibold bg-green-50 w-max px-2.5 py-1 rounded-full border border-green-100">
            <span className="pulse-dot w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5" />
            +12% so với tháng trước
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="group bg-white p-6 rounded-3xl border border-earth-100 shadow-sm hover:shadow-xl hover:shadow-namxanh-600/5 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-earth-500 group-hover:text-amber-500 transition-colors">Nhiệt độ Kho Lạnh Tối Cấp</h4>
            <div className="p-2 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
              <Thermometer className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-earth-900 tracking-tight">3.2</span>
            <span className="text-sm font-medium text-earth-500 mb-1">°C</span>
          </div>
          <div className="mt-4 flex items-center text-xs text-earth-500 font-medium">
             Trạng thái chuẩn.
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="group bg-white p-6 rounded-3xl border border-earth-100 shadow-sm hover:shadow-xl hover:shadow-namxanh-600/5 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-earth-500 group-hover:text-blue-500 transition-colors">Độ Ẩm Vùng Trồng A1</h4>
            <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
              <Droplets className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-earth-900 tracking-tight">85</span>
            <span className="text-sm font-medium text-earth-500 mb-1">%</span>
          </div>
           <div className="mt-4 flex items-center text-xs text-amber-600 font-semibold bg-amber-50 w-max px-2.5 py-1 rounded-full border border-amber-100">
            Cần bơm sương
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="col-span-1 border border-earth-100 bg-white rounded-3xl p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-earth-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center gap-3 text-earth-500 group-hover:text-namxanh-700 font-semibold mb-4 z-10">
               <MapPin className="w-5 h-5" />
               Trại liên kết mới nhất
            </div>
            
            <div className="z-10">
               <h3 className="text-xl font-bold text-earth-900 leading-tight">Nông trại Anh Bảy</h3>
               <p className="text-sm text-earth-500 mt-1 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                  Đồng Nai, VN
               </p>
               <button className="mt-6 px-4 py-2 bg-namxanh-50 hover:bg-namxanh-600 text-namxanh-700 hover:text-white rounded-xl text-sm font-semibold transition-all w-full text-left flex justify-between items-center group/btn">
                  Chi tiết lô nấm
                  <Loader2 className="w-4 h-4 hidden group-hover/btn:block animate-spin" />
               </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border border-earth-100 bg-white rounded-3xl p-6 shadow-sm">
             <h3 className="text-lg font-bold text-earth-900 mb-6 flex items-center justify-between">
                Biểu đồ luân chuyển & Mẻ nấm
                <span className="text-xs bg-earth-100 text-earth-600 px-3 py-1 rounded-full">Kỳ này</span>
             </h3>
             <div className="w-full">
                <OverviewChart />
             </div>
          </div>
          
          <div className="border border-earth-100 bg-white rounded-3xl p-6 shadow-sm">
             <h3 className="text-lg font-bold text-earth-900 mb-6">Mẻ nấm đang thu hoạch</h3>
             <div className="space-y-4">
                {[
                   { id: 'BATCH-491', name: 'Nấm Bào Ngư Xám', status: 'Thu hoạch 60%', farm: 'Trại A2', time: '1 tiếng trước' },
                   { id: 'BATCH-492', name: 'Nấm Hầu Thủ', status: 'Sẵn sàng', farm: 'Trại Cao Nguyên', time: '2 tiếng trước' },
                   { id: 'BATCH-493', name: 'Nấm Đông Trùng', status: 'Sấy khô 12h', farm: 'Trại Lab D1', time: '5 tiếng trước' },
                ].map((item, i) => (
                   <div key={i} className="group p-4 rounded-2xl border border-earth-100 hover:border-namxanh-300 hover:bg-namxanh-50/50 transition-colors flex flex-col gap-2 relative overflow-hidden">
                      <div className="flex justify-between items-start">
                         <div>
                           <span className="text-xs font-bold text-namxanh-600 bg-namxanh-50 px-2 py-0.5 rounded-md mb-1 inline-block">{item.id}</span>
                           <h4 className="font-semibold text-earth-900">{item.name}</h4>
                         </div>
                         <span className="text-xs text-earth-400">{item.time}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-medium text-earth-500 flex items-center gap-1.5">
                           <MapPin className="w-3 h-3" /> {item.farm}
                        </span>
                        <span className="text-sm text-namxanh-800 font-medium">{item.status}</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>
      </div>
    </div>
  );
}

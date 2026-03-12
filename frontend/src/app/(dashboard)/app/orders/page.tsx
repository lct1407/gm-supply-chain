"use client";

import { Truck, MapPin, Target, Package, ArrowRight, ArrowRightLeft, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  const journeys = [
    {
      id: "DO-1049",
      date: "Hôm nay, 14:30",
      status: "in-transit",
      from: "Trại Đinh Gia",
      to: "Kho Lạnh Tổng",
      load: "450kg",
      type: "Nấm tươi",
      progress: 60, // percentage
    },
    {
      id: "DO-1048",
      date: "Hôm nay, 10:15",
      status: "delivered",
      from: "Kho Thường C1",
      to: "Đại lý cấp 1 Gò Vấp",
      load: "120kg",
      type: "Nấm khô",
      progress: 100,
    },
    {
      id: "DO-1050",
      date: "Hôm nay, 16:00",
      status: "pending",
      from: "Trại Lab D1",
      to: "Siêu thị Go! Q7",
      load: "50kg",
      type: "Đông trùng hạ thảo",
      progress: 10,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-earth-900 tracking-tight">Đơn Luân Chuyển</h2>
          <p className="mt-2 text-earth-600 font-medium">Theo dõi hành trình di chuyển và trạng thái giao nhận của các lô nấm.</p>
        </div>
        <button className="px-5 py-2.5 bg-earth-900 hover:bg-earth-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-earth-900/20 flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Tạo Lệnh Điều Xe
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
         {/* Live Journey Map Tracker */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-earth-900 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-earth-500" />
              Đang Luân Chuyển (Live)
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse ml-2"></span>
            </h3>

            <div className="space-y-4">
              {journeys.map((journey) => (
                <div key={journey.id} className="bg-white p-6 rounded-3xl border border-earth-200/60 shadow-sm hover:shadow-xl hover:border-namxanh-300 transition-all duration-300 relative overflow-hidden group">
                  {/* Decorative faint path in background */}
                  <div className="absolute top-1/2 left-0 w-full h-[1px] border-b-2 border-dashed border-earth-100 -z-0"></div>
                  
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                    
                    {/* Left: Metadata */}
                    <div className="md:col-span-1 flex flex-col gap-1">
                      <span className="text-xs font-bold text-earth-500 bg-earth-100/50 px-2 py-1 rounded w-max mb-1 uppercase tracking-widest">{journey.id}</span>
                      <span className="font-bold text-earth-900">{journey.type}</span>
                      <span className="text-sm font-semibold text-namxanh-600">{journey.load}</span>
                    </div>

                    {/* Middle: Progress visualization */}
                    <div className="md:col-span-3 flex items-center justify-between relative px-2">
                       <div className="absolute top-1/2 left-0 w-full h-1.5 bg-earth-100 rounded-full -translate-y-1/2 overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full transition-all duration-1000", journey.status === 'delivered' ? 'bg-green-500' : 'bg-namxanh-500')} 
                            style={{ width: `${journey.progress}%` }} 
                          />
                       </div>

                       {/* Origin Point */}
                       <div className="relative flex flex-col items-center gap-2 bg-white px-2">
                          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border-2", journey.progress > 0 ? "border-namxanh-500 bg-namxanh-50 text-namxanh-600" : "border-earth-300 bg-earth-50 text-earth-400")}>
                            <MapPin className="w-3 h-3" />
                          </div>
                          <span className="text-xs font-semibold text-earth-600 absolute -bottom-6 w-max">{journey.from}</span>
                       </div>

                       {/* Current Truck Position */}
                       {journey.status === 'in-transit' && (
                         <div className="absolute top-1/2 -translate-y-1/2 -ml-4 bg-white p-1 rounded-full shadow-md border border-earth-200" style={{ left: `${journey.progress}%` }}>
                           <Truck className="w-5 h-5 text-namxanh-600" />
                         </div>
                       )}

                       {/* Destination Point */}
                       <div className="relative flex flex-col items-center gap-2 bg-white px-2">
                          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border-2", journey.progress === 100 ? "border-green-500 bg-green-50 text-green-600" : "border-earth-300 bg-white text-earth-400")}>
                            {journey.progress === 100 ? <CheckCircle2 className="w-3 h-3" /> : <Target className="w-3 h-3" />}
                          </div>
                          <span className="text-xs font-semibold text-earth-600 absolute -bottom-6 w-max">{journey.to}</span>
                       </div>
                    </div>

                    {/* Right: Trạng thái & Action */}
                    <div className="md:col-span-1 flex flex-col items-end gap-2 justify-center h-full">
                       <span className="text-xs font-semibold text-earth-500 flex items-center gap-1.5 mt-4 md:mt-0">
                         <Clock className="w-3.5 h-3.5" />
                         {journey.date}
                       </span>
                       <button className="text-xs font-bold text-namxanh-600 bg-namxanh-50 hover:bg-namxanh-100 px-3 py-1.5 rounded-lg transition-colors border border-namxanh-100/50">
                         Xem Chi Tiết Lộ Trình
                       </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
         </div>

         {/* Sidebar: Thống kê & Xe Cộ */}
         <div className="space-y-6">
            <div className="bg-earth-900 p-6 rounded-3xl text-white shadow-xl shadow-earth-900/20 relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 text-white/5">
                 <Truck className="w-48 h-48" />
               </div>
               <h3 className="text-lg font-bold mb-6 text-earth-100">Đội Xe Vận Tải</h3>
               
               <div className="space-y-4 relative z-10">
                 <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white text-lg">Xe Lạnh SG-59X1</span>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs font-bold rounded">Đang chạy</span>
                    </div>
                    <p className="text-sm text-earth-300">Tài xế: Nguyễn Văn A • Temp: 3.5°C</p>
                 </div>
                 
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white text-lg">Xe Tải ĐN-60B2</span>
                      <span className="px-2 py-0.5 bg-earth-500/20 text-earth-300 text-xs font-bold rounded">Đang rảnh</span>
                    </div>
                    <p className="text-sm text-earth-300">Tài xế: Lê Bình • Temp: N/A</p>
                 </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-earth-200/60 shadow-sm">
               <h3 className="text-lg font-bold text-earth-900 mb-4">Mạng Lưới Phân Phối</h3>
               <div className="aspect-square bg-earth-50 rounded-2xl border border-earth-100 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                  <Package className="w-12 h-12 text-earth-300 mb-2" />
                  <p className="text-sm font-semibold text-earth-600">Tích hợp Google Maps / Mapbox</p>
                  <p className="text-xs text-earth-400 mt-1">Sẽ hiển thị bản đồ trạm luân chuyển và định vị xe theo thời gian thực.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

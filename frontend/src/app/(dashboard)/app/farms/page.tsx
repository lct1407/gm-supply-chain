"use client";

import { MapPin, Sprout, Wind, Droplets, ThermometerSun, AlertCircle, RefreshCcw } from "lucide-react";

export default function FarmsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-earth-900 tracking-tight">Quản Lý Vùng Trồng</h2>
          <p className="mt-2 text-earth-600 font-medium">Theo dõi các chỉ số môi trường và hiện trạng nông trại.</p>
        </div>
        <button className="px-5 py-2.5 bg-earth-900 hover:bg-earth-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-earth-900/20 flex items-center gap-2">
          <Sprout className="w-4 h-4" />
          Thêm Vùng Trồng
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {[
          { name: "Nông Trại Đinh Gia", location: "Lâm Đồng, VN", status: "good", temp: "22°C", hum: "85%", o2: "20.9%" },
          { name: "Farm Nấm Nhộng", location: "Củ Chi, HCM", status: "warning", temp: "26°C", hum: "70%", o2: "20.1%" },
          { name: "Hợp tác xã Nam Bộ", location: "Đồng Nai, VN", status: "good", temp: "24°C", hum: "82%", o2: "20.8%" },
        ].map((farm, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-earth-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-namxanh-50 rounded-2xl flex items-center justify-center border border-namxanh-100">
                   <Sprout className="w-6 h-6 text-namxanh-600" />
                 </div>
                 <div>
                   <h3 className="font-bold text-earth-900 leading-none">{farm.name}</h3>
                   <span className="text-xs text-earth-500 font-medium flex items-center gap-1 mt-1.5">
                     <MapPin className="w-3 h-3" /> {farm.location}
                   </span>
                 </div>
               </div>
               {farm.status === 'warning' ? (
                 <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
               ) : (
                 <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
               )}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
               <div className="bg-earth-50 rounded-xl p-3 flex flex-col items-center justify-center gap-1 border border-earth-100/50">
                 <ThermometerSun className={`w-4 h-4 ${farm.status === 'warning' ? 'text-amber-500' : 'text-earth-500'}`} />
                 <span className="text-sm font-bold text-earth-900">{farm.temp}</span>
               </div>
               <div className="bg-earth-50 rounded-xl p-3 flex flex-col items-center justify-center gap-1 border border-earth-100/50">
                 <Droplets className={`w-4 h-4 ${farm.status === 'warning' ? 'text-amber-500' : 'text-blue-500'}`} />
                 <span className="text-sm font-bold text-earth-900">{farm.hum}</span>
               </div>
               <div className="bg-earth-50 rounded-xl p-3 flex flex-col items-center justify-center gap-1 border border-earth-100/50">
                 <Wind className="w-4 h-4 text-teal-500" />
                 <span className="text-sm font-bold text-earth-900">{farm.o2}</span>
               </div>
            </div>

            {farm.status === 'warning' && (
              <div className="bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-2 rounded-xl border border-amber-200/50 flex items-start gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Độ ẩm thấp hơn tiêu chuẩn (75-85%). Cần kích hoạt hệ thống phun sương.
              </div>
            )}

            <div className="flex gap-2">
               <button className="flex-1 px-4 py-2.5 bg-namxanh-50 hover:bg-namxanh-100 text-namxanh-700 rounded-xl text-sm font-bold transition-colors text-center border border-namxanh-200/50">
                  Xem chi tiết
               </button>
               <button className="w-10 h-10 bg-earth-50 hover:bg-earth-100 text-earth-600 rounded-xl flex items-center justify-center transition-colors border border-earth-200/50 group" title="Đồng bộ dữ liệu IoT">
                  <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

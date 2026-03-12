"use client";

import { PackageSearch, CalendarDays, FlaskConical, Sun, Thermometer, CloudRain, Clock, MoreVertical, Plus } from "lucide-react";

export default function BatchesPage() {
  const batches = [
    {
      id: "BATCH-491",
      type: "Nấm Bào Ngư Xám",
      farm: "Nông Trại Đinh Gia",
      stage: "Thu hoạch",
      progress: 60,
      days: 35,
      temp: "22°C",
      humidity: "85%",
      status: "optimal",
    },
    {
      id: "BATCH-492",
      type: "Nấm Hầu Thủ",
      farm: "Farm Nấm Nhộng",
      stage: "Ủ tơ",
      progress: 30,
      days: 15,
      temp: "25°C",
      humidity: "70%",
      status: "warning",
    },
    {
      id: "BATCH-493",
      type: "Nấm Đông Trùng",
      farm: "Trại Lab D1",
      stage: "Sấy khô",
      progress: 90,
      days: 45,
      temp: "40°C",
      humidity: "10%",
      status: "optimal",
    },
    {
      id: "BATCH-494",
      type: "Nấm Mối Đen",
      farm: "Hợp tác xã Nam Bộ",
      stage: "Kích nấm",
      progress: 45,
      days: 22,
      temp: "24°C",
      humidity: "82%",
      status: "optimal",
    },
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Ủ tơ": return "bg-earth-100 text-earth-700 border-earth-200";
      case "Kích nấm": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Thu hoạch": return "bg-green-50 text-green-700 border-green-200";
      case "Sấy khô": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header aligned with dashboard style */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-earth-900 tracking-tight">Mẻ Nấm & Lô Sản Xuất</h2>
          <p className="mt-2 text-earth-600 font-medium">Theo dõi vòng đời và thông số phát triển của từng mẻ nấm.</p>
        </div>
        <div className="flex gap-3">
           <div className="flex bg-white rounded-xl shadow-sm border border-earth-200 overflow-hidden">
             <button className="px-4 py-2 text-sm font-semibold bg-namxanh-50 text-namxanh-700 border-r border-earth-200">Đang trồng</button>
             <button className="px-4 py-2 text-sm font-semibold text-earth-600 hover:bg-earth-50">Lịch sử</button>
           </div>
           <button className="px-5 py-2.5 bg-namxanh-600 hover:bg-namxanh-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-namxanh-600/20 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tạo Mẻ Nấm
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-earth-100 shadow-sm flex items-center gap-4 group">
           <div className="w-12 h-12 bg-earth-50 rounded-2xl flex items-center justify-center border border-earth-100 group-hover:bg-namxanh-50 group-hover:border-namxanh-100 transition-colors">
             <FlaskConical className="w-6 h-6 text-earth-500 group-hover:text-namxanh-600 transition-colors" />
           </div>
           <div>
             <p className="text-xs font-semibold text-earth-500 uppercase">Tổng mẻ nấm</p>
             <p className="text-2xl font-bold text-earth-900">128</p>
           </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-earth-100 shadow-sm flex items-center gap-4 group">
           <div className="w-12 h-12 bg-earth-50 rounded-2xl flex items-center justify-center border border-earth-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
             <CloudRain className="w-6 h-6 text-earth-500 group-hover:text-blue-500 transition-colors" />
           </div>
           <div>
             <p className="text-xs font-semibold text-earth-500 uppercase">Giai đoạn kích</p>
             <p className="text-2xl font-bold text-earth-900">42</p>
           </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-earth-100 shadow-sm flex items-center gap-4 group">
           <div className="w-12 h-12 bg-earth-50 rounded-2xl flex items-center justify-center border border-earth-100 group-hover:bg-green-50 group-hover:border-green-100 transition-colors">
             <PackageSearch className="w-6 h-6 text-earth-500 group-hover:text-green-500 transition-colors" />
           </div>
           <div>
             <p className="text-xs font-semibold text-earth-500 uppercase">Đang thu hoạch</p>
             <p className="text-2xl font-bold text-earth-900">35</p>
           </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-earth-100 shadow-sm flex items-center gap-4 group">
           <div className="w-12 h-12 bg-earth-50 rounded-2xl flex items-center justify-center border border-earth-100 group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors">
             <Sun className="w-6 h-6 text-earth-500 group-hover:text-amber-500 transition-colors" />
           </div>
           <div>
             <p className="text-xs font-semibold text-earth-500 uppercase">Sấy / Chế biến</p>
             <p className="text-2xl font-bold text-earth-900">14</p>
           </div>
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {batches.map((batch, i) => (
          <div key={i} className="bg-white rounded-3xl border border-earth-200/60 shadow-sm overflow-hidden hover:shadow-xl hover:border-namxanh-200 transition-all duration-300">
            {/* Header part */}
            <div className="p-6 border-b border-earth-100 bg-gradient-to-br from-white to-earth-50/50">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex flex-col">
                   <span className="text-xs font-bold text-namxanh-700 tracking-wider font-mono">{batch.id}</span>
                   <h3 className="text-lg font-bold text-earth-900 mt-1">{batch.type}</h3>
                 </div>
                 <button className="text-earth-400 hover:text-earth-700 transition-colors">
                   <MoreVertical className="w-5 h-5" />
                 </button>
              </div>
              <p className="text-sm font-medium text-earth-600 flex items-center gap-1.5">
                 Nông trại: <span className="text-earth-900 font-bold">{batch.farm}</span>
              </p>
            </div>

            {/* Content part */}
            <div className="p-6">
               <div className="flex justify-between items-end mb-2">
                 <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getStageColor(batch.stage)}`}>
                   {batch.stage}
                 </span>
                 <span className="text-sm font-bold text-earth-900 flex items-center gap-1">
                   {batch.progress}% <span className="text-earth-400 font-medium text-xs">hoàn thành</span>
                 </span>
               </div>
               
               {/* Progress bar */}
               <div className="w-full bg-earth-100 h-2.5 rounded-full overflow-hidden mb-6">
                 <div 
                    className={`h-full rounded-full transition-all duration-1000 ${batch.status === 'warning' ? 'bg-amber-500' : 'bg-namxanh-500'}`} 
                    style={{ width: `${batch.progress}%` }}
                 />
               </div>

               {/* Metrics */}
               <div className="grid grid-cols-3 gap-3">
                 <div className="flex flex-col gap-1 p-2 bg-earth-50 rounded-xl border border-earth-100 items-center justify-center">
                   <CalendarDays className="w-4 h-4 text-earth-400" />
                   <span className="text-xs font-bold text-earth-800">{batch.days} ngày</span>
                 </div>
                 <div className={`flex flex-col gap-1 p-2 rounded-xl border items-center justify-center ${batch.status === 'warning' ? 'bg-red-50 border-red-100' : 'bg-earth-50 border-earth-100'}`}>
                   <Thermometer className={`w-4 h-4 ${batch.status === 'warning' ? 'text-red-500' : 'text-earth-400'}`} />
                   <span className={`text-xs font-bold ${batch.status === 'warning' ? 'text-red-700' : 'text-earth-800'}`}>{batch.temp}</span>
                 </div>
                 <div className="flex flex-col gap-1 p-2 bg-earth-50 rounded-xl border border-earth-100 items-center justify-center">
                   <CloudRain className="w-4 h-4 text-earth-400" />
                   <span className="text-xs font-bold text-earth-800">{batch.humidity}</span>
                 </div>
               </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 bg-earth-50 flex justify-between items-center group cursor-pointer hover:bg-namxanh-50 transition-colors">
              <span className="text-sm font-semibold text-earth-600 group-hover:text-namxanh-700 transition-colors flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Dự kiến thu: {batch.stage !== 'Thu hoạch' ? '12/04/2026' : 'Đang thu'}
              </span>
              <span className="text-xs font-bold text-namxanh-600 bg-white px-2 py-1 rounded-md border border-namxanh-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                 Chi tiết
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

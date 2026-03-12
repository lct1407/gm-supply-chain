"use client";

import { Boxes, Snowflake, Leaf, ThermometerSnowflake, PackageCheck, AlertTriangle, MapPin } from "lucide-react";

export default function InventoryPage() {
  const inventoryItems = [
    {
      id: "INV-802",
      name: "Nấm Bào Ngư Xám (Tươi)",
      category: "Nấm tươi",
      quantity: 1250,
      unit: "kg",
      warehouse: "Kho Lạnh A1",
      temp: "2°C - 5°C",
      status: "optimal",
      expiry: "4 ngày",
    },
    {
      id: "INV-803",
      name: "Nấm Hương (Đông Cô Tươi)",
      category: "Nấm tươi",
      quantity: 850,
      unit: "kg",
      warehouse: "Kho Lạnh A2",
      temp: "2°C - 5°C",
      status: "optimal",
      expiry: "5 ngày",
    },
    {
      id: "INV-804",
      name: "Nấm Mối Đen (L1)",
      category: "Nấm tươi",
      quantity: 420,
      unit: "kg",
      warehouse: "Kho Cấp Đông B1",
      temp: "-18°C",
      status: "attention",
      expiry: "6 tháng",
    },
    {
      id: "INV-805",
      name: "Bào Ngư Xám Khô",
      category: "Nấm khô",
      quantity: 300,
      unit: "kg",
      warehouse: "Kho Thường C1",
      temp: "22°C - 28°C",
      status: "optimal",
      expiry: "12 tháng",
    },
    {
      id: "INV-806",
      name: "Bột Nấm Hương",
      category: "Chế phẩm",
      quantity: 150,
      unit: "kg",
      warehouse: "Kho Thường C2",
      temp: "22°C - 28°C",
      status: "optimal",
      expiry: "18 tháng",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-earth-900 tracking-tight">Quản Lý Kho Hàng</h2>
          <p className="mt-2 text-earth-600 font-medium">Theo dõi tồn kho, nhiệt độ bảo quản và hạn sử dụng sản phẩm.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-5 py-2.5 bg-white border border-earth-200 hover:bg-earth-50 text-earth-700 rounded-xl text-sm font-semibold transition-all shadow-sm">
            Xuất Báo Cáo
           </button>
           <button className="px-5 py-2.5 bg-namxanh-600 hover:bg-namxanh-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-namxanh-600/20 flex items-center gap-2">
            <Boxes className="w-4 h-4" />
            Nhập Kho Mới
          </button>
        </div>
      </div>

      {/* Warehouse Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-blue-100/50 group-hover:scale-110 transition-transform duration-500">
             <Snowflake className="w-32 h-32" />
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-4">
               <div className="bg-blue-100 p-2 rounded-xl border border-blue-200">
                 <ThermometerSnowflake className="w-5 h-5 text-blue-600" />
               </div>
               <h3 className="font-bold text-blue-900 text-lg">Kho Lạnh (2°C - 5°C)</h3>
             </div>
             <p className="text-4xl font-extrabold text-blue-700 tracking-tight">2,100 <span className="text-xl font-medium text-blue-500">kg</span></p>
             <p className="text-sm font-medium text-blue-600 mt-2">Dung lượng: 85% / 2,500 kg (Tối ưu)</p>
             <div className="w-full bg-blue-100 h-2.5 rounded-full overflow-hidden mt-4">
                <div className="bg-blue-500 h-full rounded-full w-[85%]" />
             </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-earth-50 to-white p-6 rounded-3xl border border-earth-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-earth-100/50 group-hover:scale-110 transition-transform duration-500">
             <Leaf className="w-32 h-32" />
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-4">
               <div className="bg-earth-100 p-2 rounded-xl border border-earth-200">
                 <PackageCheck className="w-5 h-5 text-earth-600" />
               </div>
               <h3 className="font-bold text-earth-900 text-lg">Kho Thường (22°C - 28°C)</h3>
             </div>
             <p className="text-4xl font-extrabold text-earth-700 tracking-tight">450 <span className="text-xl font-medium text-earth-500">kg</span></p>
             <p className="text-sm font-medium text-earth-600 mt-2">Dung lượng: 30% / 1,500 kg (Trống nhiều)</p>
             <div className="w-full bg-earth-200 h-2.5 rounded-full overflow-hidden mt-4">
                <div className="bg-earth-500 h-full rounded-full w-[30%]" />
             </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-3xl border border-amber-100 shadow-sm relative overflow-hidden hover:shadow-xl transition-all">
           <div className="flex flex-col h-full justify-center">
             <div className="flex items-center justify-between mb-2">
               <h3 className="font-bold text-amber-900 text-lg">Cảnh báo (Attention)</h3>
               <AlertTriangle className="w-6 h-6 text-amber-500 animate-pulse" />
             </div>
             <p className="text-sm text-amber-700 font-medium">1 lô nấm tươi sắp hết hạn lưu kho (còn 2 ngày).</p>
             <button className="mt-4 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl text-sm font-bold transition-colors w-full border border-amber-200/50">
               Kiểm tra ngay lô INV-801
             </button>
           </div>
        </div>
      </div>

      {/* Inventory Table Area */}
      <div className="bg-white rounded-3xl border border-earth-200/60 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <div className="p-6 border-b border-earth-100 flex justify-between items-center bg-earth-50/50">
           <h3 className="text-lg font-bold text-earth-900">Chi tiết sản phẩm Tồn kho</h3>
           <div className="flex gap-2">
             <input 
                type="text" 
                placeholder="Tìm kiếm mã, tên..." 
                className="px-4 py-2 bg-white border border-earth-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-namxanh-500/50 focus:border-namxanh-500 w-64 shadow-inner"
             />
             <select className="px-4 py-2 bg-white border border-earth-200 rounded-xl text-sm font-medium text-earth-700 focus:outline-none focus:ring-2 focus:ring-namxanh-500/50 focus:border-namxanh-500 cursor-pointer hover:bg-earth-50 transition-colors">
               <option>Tất cả danh mục</option>
               <option>Nấm tươi</option>
               <option>Nấm khô</option>
               <option>Chế phẩm</option>
             </select>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-earth-100">
                <th className="px-6 py-4 text-xs font-bold text-earth-500 uppercase tracking-wider w-24">Mã Lô</th>
                <th className="px-6 py-4 text-xs font-bold text-earth-500 uppercase tracking-wider">Tên Sản Phẩm</th>
                <th className="px-6 py-4 text-xs font-bold text-earth-500 uppercase tracking-wider">Khối Lượng</th>
                <th className="px-6 py-4 text-xs font-bold text-earth-500 uppercase tracking-wider">Lưu Trữ / Nhiệt Độ</th>
                <th className="px-6 py-4 text-xs font-bold text-earth-500 uppercase tracking-wider">Hạn SD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100 bg-white">
              {inventoryItems.map((item, index) => (
                <tr key={index} className="hover:bg-namxanh-50/50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-namxanh-700 bg-namxanh-50 px-2.5 py-1 rounded-md border border-namxanh-100 font-mono">
                      {item.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.category === 'Nấm tươi' ? 'bg-namxanh-100 text-namxanh-600' : 'bg-earth-100 text-earth-600'}`}>
                        <Leaf className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-earth-900 group-hover:text-namxanh-800 transition-colors">{item.name}</p>
                        <p className="text-xs font-semibold text-earth-500">{item.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-earth-900">{item.quantity}</span>
                      <span className="text-sm font-semibold text-earth-500">{item.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-earth-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-earth-400" /> {item.warehouse}
                      </span>
                      <span className="text-xs font-semibold text-earth-500 flex items-center gap-1.5 mt-0.5">
                        <ThermometerSnowflake className={`w-3.5 h-3.5 ${item.temp.includes('-') || item.temp.includes('2°C') ? 'text-blue-500' : 'text-earth-400'}`} />
                        {item.temp}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                      item.status === 'optimal' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {item.expiry}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-earth-100 bg-earth-50/30 flex justify-between items-center text-sm font-medium text-earth-600">
          <span>Hiển thị 5/124 lô hàng</span>
          <div className="flex gap-1">
             <button className="px-3 py-1.5 bg-white border border-earth-200 rounded-md hover:bg-earth-50 disabled:opacity-50">Trước</button>
             <button className="px-3 py-1.5 bg-namxanh-600 text-white rounded-md hover:bg-namxanh-700 shadow-sm">1</button>
             <button className="px-3 py-1.5 bg-white border border-earth-200 rounded-md hover:bg-earth-50">2</button>
             <button className="px-3 py-1.5 bg-white border border-earth-200 rounded-md hover:bg-earth-50">3</button>
             <button className="px-3 py-1.5 bg-white border border-earth-200 rounded-md hover:bg-earth-50">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}

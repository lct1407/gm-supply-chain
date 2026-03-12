"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Sprout, ShoppingCart, ShieldCheck, CheckCircle2, Factory, TreePine, Droplets, MapPin, BadgeCheck, Phone, Mail, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('nam-tuoi');

  return (
    <div className="min-h-screen bg-earth-50 text-namxanh-950 font-sans selection:bg-namxanh-200">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-namxanh-100/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-namxanh-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-namxanh-600/20">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-namxanh-900">
              Nấm Xanh<span className="text-namxanh-500">.</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-namxanh-800">
            <Link href="#about" className="hover:text-namxanh-600 transition-colors">Về chúng tôi</Link>
            <Link href="#products" className="hover:text-namxanh-600 transition-colors">Các Sản Phẩm</Link>
            <Link href="#certifications" className="hover:text-namxanh-600 transition-colors">Tiêu Chuẩn</Link>
            <Link href="#contact" className="hover:text-namxanh-600 transition-colors">Liên hệ</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-semibold text-namxanh-700 hover:text-namxanh-500 transition-colors"
            >
              Đăng nhập Đối Tác
            </Link>
            <Link 
              href="/app" 
              className="group flex items-center gap-2 px-5 py-2.5 bg-namxanh-600 hover:bg-namxanh-700 text-white text-sm font-semibold rounded-full transition-all shadow-md shadow-namxanh-600/20"
            >
              Xem Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-namxanh-200/40 rounded-full blur-3xl -z-10 opacity-50"></div>
        
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 text-center lg:text-left z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm text-namxanh-700 font-bold text-sm mb-6 border border-namxanh-200/50 shadow-sm">
                <Leaf className="w-4 h-4" />
                <span>Nông nghiệp bền vững & Công nghệ cao</span>
              </div>
              <h1 className="text-5xl lg:text-[5rem] font-extrabold tracking-tight mb-8 leading-[1.1] text-earth-900">
                Từ Nông Trại <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-namxanh-600 to-emerald-400">
                  Đến Bàn Ăn.
                </span>
              </h1>
              <p className="text-lg text-earth-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Nông Trại Nấm Xanh chuyên nuôi trồng, sản xuất và phân phối các sản phẩm nông sản Nấm Tươi, Nấm Khô, Bột Nấm đạt tiêu chuẩn VSATTP và VietGAP. Chúng tôi mang đến hệ sinh thái chuỗi cung ứng minh bạch 100%.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link 
                  href="#products" 
                  className="w-full sm:w-auto px-8 py-4 bg-namxanh-600 hover:bg-namxanh-700 text-white rounded-full font-bold transition-all shadow-xl shadow-namxanh-600/30 flex items-center justify-center gap-2 group"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Khám phá Sản Phẩm
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="#traceability" 
                  className="w-full sm:w-auto px-8 py-4 bg-white/80 hover:bg-white text-earth-900 border border-namxanh-200 rounded-full font-bold transition-all shadow-lg shadow-earth-200/20 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 text-namxanh-600" />
                  Hệ Sinh Thái Truy Xuất
                </Link>
              </div>

              <div className="mt-12 flex items-center justify-center lg:justify-start gap-12 border-t border-earth-200/60 pt-8">
                <div className="flex flex-col">
                  <span className="text-4xl font-extrabold text-namxanh-600 tracking-tight">50+</span>
                  <span className="text-sm font-semibold text-earth-500 mt-1 uppercase tracking-wider">Trại Liên Kết</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-extrabold text-namxanh-600 tracking-tight">100%</span>
                  <span className="text-sm font-semibold text-earth-500 mt-1 uppercase tracking-wider">Sạch - VSATTP</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-extrabold text-namxanh-600 tracking-tight">15+</span>
                  <span className="text-sm font-semibold text-earth-500 mt-1 uppercase tracking-wider">Loại Sản Phẩm</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative w-full aspect-square lg:aspect-[4/3] max-w-lg mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-namxanh-400 to-emerald-200 rounded-[3rem] transform rotate-3 scale-105 opacity-20"></div>
              <div className="absolute inset-0 bg-white rounded-[3rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col">
                 <div className="h-12 bg-earth-50 border-b border-earth-100 flex items-center px-6 gap-2">
                    <div className="flex gap-1.5">
                       <div className="w-3 h-3 rounded-full bg-red-400"></div>
                       <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                       <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="mx-auto bg-white px-4 py-1 rounded-md text-xs font-semibold text-earth-500 border border-earth-200 shadow-sm flex items-center gap-2">
                       <Lock className="w-3 h-3" />
                       app.namxanh.vn
                    </div>
                 </div>
                 
                 {/* App UI Mock inside Landing */}
                 <div className="flex-1 bg-earth-50/50 p-6 flex flex-col gap-4 relative overflow-hidden">
                    {/* Floating badge */}
                    <div className="absolute top-8 right-8 bg-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3 border border-namxanh-100 animate-bounce delay-75 duration-1000">
                       <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                          <CheckCircle2 className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-earth-900">Lô Bào Ngư Mới</p>
                          <p className="text-xs text-earth-500">Đã kiểm định an toàn</p>
                       </div>
                    </div>

                    <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 bg-namxanh-600 rounded-2xl"></div>
                       <div className="h-6 w-32 bg-earth-200 rounded-lg"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                       <div className="h-32 bg-white rounded-3xl shadow-sm border border-earth-100 p-4 flex flex-col justify-between">
                         <div className="w-8 h-8 rounded-full bg-namxanh-100"></div>
                         <div className="h-8 w-20 bg-earth-100 rounded-lg"></div>
                       </div>
                       <div className="h-32 bg-white rounded-3xl shadow-sm border border-earth-100 p-4 flex flex-col justify-between">
                         <div className="w-8 h-8 rounded-full bg-blue-100"></div>
                         <div className="h-8 w-16 bg-earth-100 rounded-lg"></div>
                       </div>
                    </div>

                    <div className="flex-1 mt-2 bg-white rounded-3xl shadow-sm border border-earth-100 p-4">
                       <div className="h-4 w-1/3 bg-earth-100 rounded-full mb-4"></div>
                       <div className="space-y-3">
                          <div className="h-10 w-full bg-earth-50 rounded-xl"></div>
                          <div className="h-10 w-full bg-earth-50 rounded-xl"></div>
                          <div className="h-10 w-3/4 bg-earth-50 rounded-xl"></div>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* About Section */}
      <section id="about" className="py-24 bg-white relative">
         <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-sm font-extrabold text-namxanh-600 uppercase tracking-widest mb-3">Về Nông Trại Nấm Xanh</h2>
               <p className="text-4xl lg:text-5xl font-extrabold text-earth-900 tracking-tight leading-tight">Nuôi Trồng Tận Tâm,<br/>Giá Trị Đích Thực.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-earth-50 p-8 rounded-[2rem] hover:bg-namxanh-50 hover:-translate-y-2 transition-all duration-300 group border border-earth-100">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:shadow-md transition-all">
                     <TreePine className="w-8 h-8 text-namxanh-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-earth-900 mb-4">Môi Trường Tự Nhiên</h3>
                  <p className="text-earth-600 leading-relaxed font-medium">Các nông trại liên kết được đặt tại vùng khí hậu ôn hòa (Lâm Đồng, Đồng Nai), thiết lập mô hình nhà kính tự động hóa kiểm soát nghiêm ngặt 24/7 nhiệt độ và O2.</p>
               </div>
               <div className="bg-earth-50 p-8 rounded-[2rem] hover:bg-namxanh-50 hover:-translate-y-2 transition-all duration-300 group border border-earth-100">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:shadow-md transition-all">
                     <Droplets className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-earth-900 mb-4">Quy Trình Sạch 100%</h3>
                  <p className="text-earth-600 leading-relaxed font-medium">Toàn bộ giá thể phôi nấm làm từ nguyên liệu hữu cơ (mùn cưa cao su, thân bắp). Sử dụng nguồn nước tưới tinh khiết được lọc RO, nói KHÔNG với phân bón hóa học.</p>
               </div>
               <div className="bg-earth-50 p-8 rounded-[2rem] hover:bg-namxanh-50 hover:-translate-y-2 transition-all duration-300 group border border-earth-100">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:shadow-md transition-all">
                     <Factory className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-earth-900 mb-4">Công Nghệ Chế Biến</h3>
                  <p className="text-earth-600 leading-relaxed font-medium">Hệ thống sấy lạnh chuẩn Châu Âu giúp nấm Khô giữ nguyên 99% dược tính, hương vị và màu sắc. Quy trình luân chuyển khép kín từ kho lạnh đến nhà máy.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-namxanh-900 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-namxanh-600/30 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>

         <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
               <div className="max-w-2xl">
                  <h2 className="text-sm font-extrabold text-namxanh-300 uppercase tracking-widest mb-3">Danh mục sản phẩm</h2>
                  <p className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">Sản Phẩm Nổi Bật <br/>Từ Nấm Xanh</p>
               </div>
               <div className="flex bg-white/10 p-1.5 rounded-full backdrop-blur-md">
                  <button 
                    onClick={() => setActiveTab('nam-tuoi')}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'nam-tuoi' ? 'bg-white text-namxanh-900 shadow-md' : 'text-white/70 hover:text-white'}`}
                  >
                     Nấm Tươi
                  </button>
                  <button 
                    onClick={() => setActiveTab('nam-kho')}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'nam-kho' ? 'bg-white text-namxanh-900 shadow-md' : 'text-white/70 hover:text-white'}`}
                  >
                     Nấm Khô & Chế phẩm
                  </button>
               </div>
            </div>

            <AnimatePresence mode="wait">
               {activeTab === 'nam-tuoi' && (
                 <motion.div 
                   key="tuoi"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   transition={{ duration: 0.4 }}
                   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                 >
                    {[
                      { name: "Nấm Hầu Thủ Tươi", desc: "Tên khác: Nấm đầu khỉ. Ăn ngon, dai ngọt như thịt gà, tác dụng bồi bổ tỳ vị cực tốt.", tag: "Best Seller" },
                      { name: "Nấm Đông Trùng Hạ Thảo", desc: "Nguồn dược liệu quý giúp tăng cường miễn dịch, cải thiện giấc ngủ, bổ phổi.", tag: "Cao Cấp" },
                      { name: "Nấm Mối Đen Tươi (L1)", desc: "Giòn sần sật, vị ngọt ngào. Khẳng định đẳng cấp món lẩu và ẩm thực cao cấp.", tag: "Hàng Mới" },
                      { name: "Nấm Bào Ngư Xám", desc: "Sản lượng khủng mỗi ngày. Món ăn quen thuộc giàu protein thay thế thịt.", tag: "Phổ Thông" },
                    ].map((item, i) => (
                       <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors group">
                          <div className="aspect-[4/3] bg-gradient-to-br from-white/10 to-transparent rounded-2xl mb-6 flex items-center justify-center border border-white/5 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                             <Sprout className="w-16 h-16 text-white/30" />
                             <span className="absolute top-3 left-3 bg-namxanh-500 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-xl shadow-namxanh-500/30">
                                {item.tag}
                             </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2 text-white">{item.name}</h3>
                          <p className="text-white/60 text-sm font-medium leading-relaxed">{item.desc}</p>
                       </div>
                    ))}
                 </motion.div>
               )}
               {activeTab === 'nam-kho' && (
                 <motion.div 
                   key="kho"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   transition={{ duration: 0.4 }}
                   className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6"
                 >
                   {[
                      { name: "Nấm Bào Ngư Xám Khô", desc: "Công nghệ sấy lạnh giữ trọn màu sắc. Mềm lại nhanh khi ngâm nước." },
                      { name: "Nấm Mèo Khô (Mộc Nhĩ)", desc: "Sạch gốc, giòn tan. Gia vị không thể thiếu trong món miến, chả giò." },
                      { name: "Bột Nấm Hương", desc: "Dùng nêm nếm vạn món ngon chay mặn, thay thế 100% bột ngọt." },
                   ].map((item, i) => (
                      <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors group">
                          <div className="aspect-[4/3] bg-gradient-to-br from-amber-500/10 to-transparent rounded-2xl mb-6 flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform duration-500">
                             <Leaf className="w-16 h-16 text-amber-500/50" />
                          </div>
                          <h3 className="text-xl font-bold mb-2 text-white">{item.name}</h3>
                          <p className="text-white/60 text-sm font-medium leading-relaxed">{item.desc}</p>
                       </div>
                   ))}
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </section>

      {/* Certifications / Traceability System */}
      <section id="certifications" className="py-24 bg-white">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="order-2 lg:order-1 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-earth-200 to-namxanh-100 rounded-[3rem] transform -rotate-3 scale-105"></div>
                  <div className="relative bg-white rounded-[3rem] shadow-xl border border-earth-100 p-8 xl:p-12">
                     <h3 className="text-2xl font-extrabold text-earth-900 mb-8 border-b border-earth-100 pb-4">Công nghệ Truy Xuất</h3>
                     <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                           <div className="w-12 h-12 rounded-xl bg-namxanh-50 flex items-center justify-center text-namxanh-600 shrink-0">
                              <MapPin className="w-6 h-6" />
                           </div>
                           <div>
                              <h4 className="text-lg font-bold text-earth-900">Track & Trace Thời gian thực</h4>
                              <p className="text-earth-600 font-medium text-sm mt-1">Mỗi lô nấm đều có mã QR. Quét để xem vị trí trang trại trồng, ngày cấy meo, thông số nhiệt độ nuôi.</p>
                           </div>
                        </div>
                        <div className="flex gap-4 items-start">
                           <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                              <BadgeCheck className="w-6 h-6" />
                           </div>
                           <div>
                              <h4 className="text-lg font-bold text-earth-900">Giấy Kiểm định ATTP Update định kỳ</h4>
                              <p className="text-earth-600 font-medium text-sm mt-1">Hồ sơ công bố chất lượng và các bài test kim loại nặng được công khai minh bạch cho từng dòng sản phẩm.</p>
                           </div>
                        </div>
                        <div className="flex gap-4 items-start">
                           <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                              <Factory className="w-6 h-6" />
                           </div>
                           <div>
                              <h4 className="text-lg font-bold text-earth-900">Đóng gói chuẩn GMP</h4>
                              <p className="text-earth-600 font-medium text-sm mt-1">Quy định mặc đồ bảo hộ 100%, khử trùng phòng kín trước khi thu hái và đóng hộp chân không ngay tại nhà máy.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="order-1 lg:order-2">
                  <h2 className="text-sm font-extrabold text-namxanh-600 uppercase tracking-widest mb-3">Chất lượng Quốc tế</h2>
                  <p className="text-4xl lg:text-5xl font-extrabold text-earth-900 tracking-tight leading-tight mb-8">
                     Tiêu Chuẩn Làm Nên Thương Hiệu.
                  </p>
                  <p className="text-lg text-earth-600 leading-relaxed font-medium mb-10">
                     Hơn cả việc bán nấm, chúng tôi cam kết bán "Sự an tâm" trực tiếp lên mâm cơm Việt. Đó là lý do hệ thống phần mềm Supply Chain hiện tại được thiết kế chuyên biệt để kết nối thông tin không giới hạn.
                  </p>
                  <Link 
                     href="/app" 
                     className="inline-flex items-center gap-3 px-8 py-4 bg-earth-900 hover:bg-earth-800 text-white rounded-full font-bold transition-all shadow-xl shadow-earth-900/20"
                  >
                     Trải nghiệm App Quản Trị
                     <ArrowRight className="w-5 h-5" />
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* Footer Contact */}
      <footer id="contact" className="bg-earth-950 text-earth-300 py-16 border-t border-earth-800">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
               <div className="lg:col-span-2">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="w-10 h-10 bg-namxanh-600 bg-opacity-20 rounded-xl flex items-center justify-center text-namxanh-500">
                     <Leaf className="w-6 h-6" />
                     </div>
                     <span className="text-2xl font-bold tracking-tight text-white">
                     Nấm Xanh.
                     </span>
                  </div>
                  <p className="text-earth-400 font-medium max-w-sm">Hệ sinh thái nuôi trồng và phân phối nông sản Xanh - Sạch - Hiện đại số 1 tại Việt Nam.</p>
               </div>
               <div>
                  <h4 className="text-white font-bold mb-6 tracking-wide">Điều hướng</h4>
                  <ul className="space-y-3 font-medium text-sm">
                     <li><Link href="#about" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
                     <li><Link href="#products" className="hover:text-white transition-colors">Sản phẩm nổi bật</Link></li>
                     <li><Link href="#certifications" className="hover:text-white transition-colors">Tiêu chuẩn chất lượng</Link></li>
                     <li><Link href="/login" className="hover:text-white transition-colors text-namxanh-400">Đăng nhập Đối tác</Link></li>
                  </ul>
               </div>
               <div>
                  <h4 className="text-white font-bold mb-6 tracking-wide">Liên hệ</h4>
                  <ul className="space-y-4 font-medium text-sm">
                     <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-earth-500" /> Quận Gò Vấp, TP.HCM</li>
                     <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-earth-500" /> 0938.XXX.XXX</li>
                     <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-earth-500" /> hi@namxanh.vn</li>
                  </ul>
               </div>
            </div>
            <div className="border-t border-earth-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-semibold text-earth-500 tracking-wider">
               <p>© 2026 Nấm Xanh Corporation. All rights reserved.</p>
               <div className="flex gap-4 mt-4 md:mt-0">
                  <span>Privacy Policy</span>
                  <span>Terms of Service</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}

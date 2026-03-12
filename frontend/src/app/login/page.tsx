"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-earth-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('/bg-pattern.svg')] bg-repeat">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-12 h-12 bg-namxanh-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-namxanh-600/20">
              <Leaf className="w-7 h-7" />
            </div>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-earth-900 tracking-tight">
          Đăng nhập hệ thống
        </h2>
        <p className="mt-2 text-center text-sm text-earth-600">
          Hoặc{" "}
          <Link href="/" className="font-medium text-namxanh-600 hover:text-namxanh-500 transition-colors">
            trở về trang chủ
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-earth-200/40 sm:rounded-3xl sm:px-10 border border-earth-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-namxanh-400 to-namxanh-600"></div>
          <form className="space-y-6" action="/app">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-earth-700">
                Email / Tên đăng nhập
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-earth-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue="admin@namxanh.vn"
                  className="block w-full pl-10 pr-3 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-namxanh-500/50 focus:border-namxanh-500 sm:text-sm transition-all"
                  placeholder="admin@namxanh.vn"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-earth-700">
                Mật khẩu
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-earth-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  defaultValue="password123"
                  className="block w-full pl-10 pr-3 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-namxanh-500/50 focus:border-namxanh-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-namxanh-600 focus:ring-namxanh-500 border-earth-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-earth-600 font-medium">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-namxanh-600 hover:text-namxanh-500">
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <div>
              <Link
                href="/app"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-namxanh-600 hover:bg-namxanh-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-namxanh-500 transition-all group"
              >
                Đăng nhập vào App
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-earth-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-earth-500 bg-earth-50 rounded-full">Dành cho Đối tác Nấm Xanh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

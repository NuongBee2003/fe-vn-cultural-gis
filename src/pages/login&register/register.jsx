import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import VNCulture from "@/assets/img/holiday/vnculture.jpg";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--brand-bg)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-7xl grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-[var(--brand-primary-18)] shadow-2xl bg-white">

        {/* Left */}
        <div
          className="hidden lg:flex flex-col justify-end relative overflow-hidden bg-cover bg-center p-12"
          style={{
            backgroundImage: `url(${VNCulture})`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/55"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="mb-6">
              <h1 className="text-5xl font-extrabold text-white tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                VietCulture
              </h1>

              <p className="text-xl font-semibold text-amber-200 mt-2 tracking-wide">
                Bản đồ Văn hóa & Du lịch Việt Nam
              </p>
            </div>

            <h2 className="text-4xl font-bold leading-tight text-white mb-5 max-w-[520px] drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
              Bắt đầu hành trình khám phá Việt Nam
            </h2>

            <p className="text-gray-100 text-lg leading-relaxed font-medium max-w-md drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              Tạo tài khoản để lưu địa điểm yêu thích, chia sẻ trải nghiệm
              văn hóa và kết nối cộng đồng du lịch Việt Nam.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center justify-center p-6 sm:p-10 bg-white">
          <div className="w-full max-w-md">
            
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold tracking-tight text-[#B8922E]">
                Đăng ký
              </h2>

              <p className="text-base text-[#7A5C12] mt-2 font-medium">
                Tạo tài khoản mới ngay hôm nay
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5">

              {/* Fullname */}
              <div>
                <label className="block text-sm font-semibold text-[#B8922E] mb-2">
                  Họ và tên
                </label>

                <div className="flex items-center border border-[#E5D3A1] bg-[#FFFDF8] rounded-xl px-4 h-12 focus-within:border-[#C9A646] focus-within:ring-2 focus-within:ring-[#F4E3B2] transition-all">
                  <User
                    size={18}
                    className="text-[#B8922E] mr-3 shrink-0"
                  />

                  <input
                    type="text"
                    placeholder="Nhập họ và tên"
                    className="flex-1 outline-none bg-transparent text-sm"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-[#B8922E] mb-2">
                  Số điện thoại
                </label>

                <div className="flex items-center border border-[#E5D3A1] bg-[#FFFDF8] rounded-xl px-4 h-12 focus-within:border-[#C9A646] focus-within:ring-2 focus-within:ring-[#F4E3B2] transition-all">
                  <Phone
                    size={18}
                    className="text-[#B8922E] mr-3 shrink-0"
                  />

                  <input
                    type="text"
                    placeholder="Nhập số điện thoại"
                    className="flex-1 outline-none bg-transparent text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[#B8922E] mb-2">
                  Email
                </label>

                <div className="flex items-center border border-[#E5D3A1] bg-[#FFFDF8] rounded-xl px-4 h-12 focus-within:border-[#C9A646] focus-within:ring-2 focus-within:ring-[#F4E3B2] transition-all">
                  <Mail
                    size={18}
                    className="text-[#B8922E] mr-3 shrink-0"
                  />

                  <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="flex-1 outline-none bg-transparent text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-[#B8922E] mb-2">
                  Mật khẩu
                </label>

                <div className="flex items-center border border-[#E5D3A1] bg-[#FFFDF8] rounded-xl px-4 h-12 focus-within:border-[#C9A646] focus-within:ring-2 focus-within:ring-[#F4E3B2] transition-all">
                  <Lock
                    size={18}
                    className="text-[#B8922E] mr-3 shrink-0"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    className="flex-1 outline-none bg-transparent text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#B8922E] hover:text-[#8C6A16] transition-all"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" />

                <p className="text-[#7A5C12]">
                  Tôi đồng ý với{" "}
                  <span className="text-[#B8922E] font-semibold cursor-pointer hover:underline">
                    điều khoản sử dụng
                  </span>
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#C9A646] hover:bg-[#B8922E] text-white text-lg font-bold shadow-lg transition-all"
              >
                Đăng ký
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-gray-200"></div>

              <span className="text-sm text-[#B8922E] font-semibold">
                HOẶC
              </span>

              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3">
              <button className="h-11 rounded-xl border border-[#E5D3A1] bg-[#FFFDF8] text-sm font-semibold text-[#7A5C12] hover:bg-[#FFF4D6] transition-all">
                Google
              </button>

              <button className="h-11 rounded-xl border border-[#E5D3A1] bg-[#FFFDF8] text-sm font-semibold text-[#7A5C12] hover:bg-[#FFF4D6] transition-all">
                Facebook
              </button>
            </div>

            {/* Login */}
            <p className="text-center text-sm text-[#7A5C12] mt-7">
              Bạn đã có tài khoản?{" "}
              <NavLink
                to={PATHS.LOGIN}
                className="text-[#B8922E] font-bold hover:underline"
              >
                Đăng nhập ngay
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
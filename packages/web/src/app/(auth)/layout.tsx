export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left: Form Content */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right: Brand Imagery */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-[#1A3C5E] to-[#0f2337] relative overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#E8733A]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-[#E8733A]/10 rounded-full blur-2xl" />
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 bg-[#E8733A] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-3xl font-bold">P</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Partner</h2>
          <p className="text-white/70 text-lg">
            Travel Together. Explore Beyond.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <div className="w-2 h-2 rounded-full bg-[#E8733A]" />
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <div className="w-2 h-2 rounded-full bg-white/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

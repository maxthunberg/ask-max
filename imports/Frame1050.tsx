function BetaTag() {
  return (
    <div className="bg-[rgba(235,212,33,0.15)] box-border content-stretch flex gap-[10px] items-center justify-center px-[4px] py-0 relative rounded-[4px] shrink-0" data-name="Beta tag">
      <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ebd421] text-[16px] text-nowrap whitespace-pre">Beta</p>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative size-full">
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Max Thunberg</p>
      <BetaTag />
    </div>
  );
}
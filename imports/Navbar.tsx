function LinkBase() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full" data-name="Link Base">
      <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#c7c1cc] text-[16px] text-nowrap whitespace-pre">Home</p>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Link">
      <LinkBase />
    </div>
  );
}

function LinkBase1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full" data-name="Link Base">
      <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#c7c1cc] text-[16px] text-nowrap whitespace-pre">Leadership Philosophy</p>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Link">
      <LinkBase1 />
    </div>
  );
}

function LinkBase2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full" data-name="Link Base">
      <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#c7c1cc] text-[16px] text-nowrap whitespace-pre">LinkedIn</p>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Link">
      <LinkBase2 />
    </div>
  );
}

function Links() {
  return (
    <div className="content-stretch flex gap-[24px] items-center opacity-80 relative shrink-0" data-name="Links">
      <Link />
      <Link1 />
      <Link2 />
    </div>
  );
}

export default function Navbar() {
  return (
    <div className="relative size-full" data-name="Navbar">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[32px] items-center px-[16px] py-[11px] relative size-full">
          <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Max Thunberg</p>
          <Links />
        </div>
      </div>
    </div>
  );
}
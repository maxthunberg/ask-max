import svgPaths from "./svg-z3ldfb28xk";
const imgMaxT12 = "/images/max-thunberg.jpg";
const imgMaxT13 = "/images/max-thunberg.jpg";

function TextContainer() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[156px] top-[243px]" data-name="Text container">
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[60px] relative shrink-0 text-[48px] text-white w-[689px]">Building teams with empathy, designing systems for impact.</p>
      <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[28px] relative shrink-0 text-[#c7c1cc] text-[18px] w-[689px]">I’m a servant leader who removes obstacles so my team can thrive. Driven by meaningful impact and prepared to do what it takes, a mindset that shaped my early golf career and still true today.</p>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[156px] top-[483px]">
      <p className="absolute font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] left-[156px] text-[#f6f7fc] text-[16px] text-nowrap top-[483px] whitespace-pre">Talk to my digital twin</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[156px] top-[483px]">
      <Group3 />
    </div>
  );
}

function InputField() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] box-border content-stretch flex gap-[12px] items-center left-[156px] p-[12px] rounded-[8px] top-[511px] w-[640px]" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#c7c1cc] text-[16px] text-nowrap whitespace-pre">Ask me anything about UX and leadership</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p35129400} id="Vector" stroke="var(--stroke-0, #F6F7FC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ButtonPrimary() {
  return (
    <div className="absolute bg-[#7339ff] box-border content-stretch flex gap-[12px] items-center justify-center p-[8px] right-[720px] rounded-[8px] top-[515px]" data-name="Button Primary">
      <Frame />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[156px] top-[511px]">
      <InputField />
      <ButtonPrimary />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-[156px] top-[483px]">
      <Group2 />
      <Group4 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p1188cf84} id="Vector" stroke="var(--stroke-0, #F6F7FC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ButtonSecondary() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] box-border content-stretch flex gap-[12px] items-center justify-center left-[156px] px-[16px] py-[12px] rounded-[8px] top-[583px]" data-name="Button Secondary">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#f6f7fc] text-[16px] text-center text-nowrap whitespace-pre">Talk to the real me</p>
      <Frame1 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[156px] top-[583px]">
      <ButtonSecondary />
    </div>
  );
}

function Image() {
  return (
    <div className="absolute contents left-[845px] top-[207px]" data-name="Image">
      <div className="absolute h-[701px] left-[845px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[526px_701px] top-[207px] w-[526px]" data-name="Max_T (1) 2" style={{ maskImage: `url('${imgMaxT12}')` }}>
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgMaxT13} />
      </div>
      <div className="absolute bg-[#7339ff] h-[730px] left-[calc(50%+352px)] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-15px_29px] mask-size-[526px_701px] mix-blend-color opacity-20 top-[178px] translate-x-[-50%] w-[496px]" data-name="Overlay" style={{ maskImage: `url('${imgMaxT12}')` }} />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents leading-[20px] left-[600px] text-[14px] text-right top-[836px]">
      <p className="absolute font-['Figtree:Regular',sans-serif] font-normal left-[816px] opacity-80 text-[#c7c1cc] top-[856px] translate-x-[-100%] w-[216px]">Currently UX Lead at Volvo Group</p>
      <p className="absolute font-['Figtree:SemiBold',sans-serif] font-semibold left-[816px] text-white top-[836px] translate-x-[-100%] w-[173px]">This is me</p>
    </div>
  );
}

function Details() {
  return (
    <div className="absolute contents left-[600px] top-[767px]" data-name="Details">
      <Group1 />
      <div className="absolute h-[81.5px] left-[824px] top-[767px] w-[39px]">
        <div className="absolute inset-[-4.72%_-2.56%_-1.13%_-1%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41 87">
            <path d={svgPaths.pec1c610} fill="var(--stroke-0, #E4BE3A)" id="Vector 59" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Hero Section">
      <div className="absolute bg-gradient-to-b border-[0px_0px_1px] border-[rgba(255,255,255,0.15)] border-dashed from-[#170641] h-[908px] right-0 to-[#130521] top-0 w-[1512px]" data-name="Background" />
      <TextContainer />
      <Group5 />
      <Group />
      <Image />
      <Details />
    </div>
  );
}

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

function Navbar() {
  return (
    <div className="absolute box-border content-stretch flex gap-[32px] h-[64px] items-center left-1/2 px-[16px] py-[11px] top-0 translate-x-[-50%] w-[1232px]" data-name="Navbar">
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Max Thunberg</p>
      <Links />
    </div>
  );
}

function Grid() {
  return (
    <div className="absolute bottom-0 contents left-[140px] top-0" data-name="Grid">
      <div className="absolute border border-dashed border-white bottom-0 left-[calc(50%-615.5px)] opacity-[0.15] top-0 translate-x-[-50%] w-px" />
      <div className="absolute border border-dashed border-white bottom-0 opacity-[0.15] right-[140px] top-0 w-px" />
    </div>
  );
}

export default function FrontPage() {
  return (
    <div className="bg-[#130521] relative size-full" data-name="Front Page">
      <HeroSection />
      <Navbar />
      <Grid />
    </div>
  );
}
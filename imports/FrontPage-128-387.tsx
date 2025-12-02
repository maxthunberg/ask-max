import svgPaths from "./svg-sevsv6x2yc";
import imgMaxT12 from "figma:asset/ca9811084fbbbf687eceb2a4e136e80958f1b1e4.png";
import imgMaxT13 from "figma:asset/ecfad83766f090d70dd01833d9176a81aa74adea.png";

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
    <div className="box-border content-stretch flex gap-[32px] h-[64px] items-center px-[16px] py-[11px] relative shrink-0 w-[1232px]" data-name="Navbar">
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Max Thunberg</p>
      <Links />
    </div>
  );
}

function TextContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Text container">
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[50px] relative shrink-0 text-[40px] text-white w-[640px]">Building teams with empathy, designing systems for impact.</p>
      <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#c7c1cc] text-[16px] w-[640px]">Instead of scrolling, you can chat directly with a digital version of me, trained to share how I work, lead, and design for impact.</p>
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
    <div className="absolute bg-[#7339ff] bottom-[8px] box-border content-stretch flex gap-[12px] items-center justify-center p-[8px] right-[8px] rounded-[8px]" data-name="Button Primary">
      <Frame />
    </div>
  );
}

function SearchInput() {
  return (
    <div className="bg-[#21123c] relative rounded-[12px] shrink-0 w-full" data-name="Search input">
      <div aria-hidden="true" className="absolute border border-[#4d4164] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] items-center pl-[12px] pr-[56px] py-[16px] relative w-full">
          <ButtonPrimary />
          <p className="absolute font-['Figtree:Regular',sans-serif] font-normal leading-[24px] left-[12px] opacity-70 text-[#c7c1cc] text-[16px] top-[16px] w-[572px]">Ask me about UX, leadership or whatever you feel like</p>
        </div>
      </div>
    </div>
  );
}

function SearchInput1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Search input">
      <SearchInput />
    </div>
  );
}

function MainContainer() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[24px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Main container">
      <TextContainer />
      <SearchInput1 />
    </div>
  );
}

function Image() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Image">
      <div className="[grid-area:1_/_1] h-[701px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[526px_701px] ml-0 mt-0 relative w-[526px]" data-name="Max_T (1) 2" style={{ maskImage: `url('${imgMaxT12}')` }}>
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgMaxT13} />
      </div>
      <div className="[grid-area:1_/_1] bg-[#7339ff] h-[701px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.5px_0px] mask-size-[526px_701px] mix-blend-color ml-[0.5px] mt-0 opacity-20 w-[526px]" data-name="Overlay" style={{ maskImage: `url('${imgMaxT12}')` }} />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute bottom-[32px] contents leading-[20px] right-[647px] text-[14px] text-right">
      <p className="absolute bottom-[20px] font-['Figtree:Regular',sans-serif] font-normal opacity-80 right-0 text-[#c7c1cc] translate-y-[100%] w-[216px]">Currently UX Lead at Volvo Group</p>
      <p className="absolute bottom-[20px] font-['Figtree:SemiBold',sans-serif] font-semibold right-0 text-white translate-y-[100%] w-[173px]">This is me</p>
    </div>
  );
}

function ImageDetails() {
  return (
    <div className="absolute bottom-[32px] contents right-[600px]" data-name="Image details">
      <Group />
      <div className="absolute bottom-[59.5px] h-[81.5px] right-[600px] w-[39px]">
        <div className="absolute inset-[-4.72%_-2.56%_-1.13%_-1%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41 87">
            <path d={svgPaths.pec1c610} fill="var(--stroke-0, #E4BE3A)" id="Vector 59" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ImageContainer() {
  return (
    <div className="basis-0 content-stretch flex grow h-full items-end min-h-px min-w-px relative shrink-0" data-name="Image container">
      <Image />
      <ImageDetails />
    </div>
  );
}

function HeroSection() {
  return (
    <div className="basis-0 box-border content-stretch flex grow items-center min-h-px min-w-px px-[16px] py-0 relative shrink-0 w-[1232px]" data-name="Hero Section">
      <MainContainer />
      <ImageContainer />
    </div>
  );
}

function PageContent() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-center max-w-[1232px] min-h-px min-w-px relative shrink-0 w-full" data-name="Page content">
      <div aria-hidden="true" className="absolute border-[0px_1px] border-[rgba(255,255,255,0.15)] border-dashed inset-0 pointer-events-none" />
      <Navbar />
      <HeroSection />
    </div>
  );
}

export default function FrontPage() {
  return (
    <div className="bg-gradient-to-b from-[#170641] relative size-full to-[#130521]" data-name="Front Page">
      <div className="content-stretch flex flex-col items-center relative size-full">
        <PageContent />
      </div>
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.15)] border-dashed inset-0 pointer-events-none" />
    </div>
  );
}
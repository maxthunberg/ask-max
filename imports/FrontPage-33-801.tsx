import svgPaths from "./svg-npvbmw8egm";
import imgMaxT12 from "figma:asset/1747899fe2c1d97a5ced4751efb38ee52753edbe.png";
import imgMaxT13 from "figma:asset/ecfad83766f090d70dd01833d9176a81aa74adea.png";

function TextContainer() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[156px] opacity-0 top-[334px]" data-name="Text container">
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[50px] relative shrink-0 text-[40px] text-white w-[640px]">Building teams with empathy, designing systems for impact.</p>
      <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#c7c1cc] text-[16px] w-[640px]">Instead of scrolling, you can chat directly with a digital version of me, trained to share how I work, lead, and design for impact.</p>
    </div>
  );
}

function InputField() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] box-border content-stretch flex gap-[12px] items-center left-[436px] px-[12px] py-[16px] rounded-[12px] top-[804px] w-[640px]" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] opacity-70 relative shrink-0 text-[#c7c1cc] text-[16px] text-nowrap whitespace-pre">Ask me about UX, leadership or whatever you feel like</p>
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
    <div className="absolute bg-[#7339ff] box-border content-stretch flex gap-[12px] items-center justify-center p-[8px] right-[444px] rounded-[8px] top-[812px]" data-name="Button Primary">
      <Frame />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[436px] top-[804px]">
      <InputField />
      <ButtonPrimary />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[436px] top-[804px]">
      <Group1 />
    </div>
  );
}

function Image() {
  return (
    <div className="absolute contents left-[864.51px] top-[275px]" data-name="Image">
      <div className="absolute h-[649px] left-[864.79px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.282px_0px] mask-size-[486.699px_649px] opacity-0 top-[275px] w-[486.699px]" data-name="Max_T (1) 2" style={{ maskImage: `url('${imgMaxT12}')` }}>
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgMaxT13} />
      </div>
      <div className="absolute bg-[#7339ff] h-[675.849px] left-[calc(50%+352px)] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-13.887px_26.849px] mask-size-[486.699px_649px] mix-blend-color opacity-0 top-[248.15px] translate-x-[-50%] w-[459.207px]" data-name="Overlay" style={{ maskImage: `url('${imgMaxT12}')` }} />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents leading-[20px] left-[610px] text-[14px] text-right top-[836px]">
      <p className="absolute font-['Figtree:Regular',sans-serif] font-normal left-[826px] opacity-0 text-[#c7c1cc] top-[856px] translate-x-[-100%] w-[216px]">Currently UX Lead at Volvo Group</p>
      <p className="absolute font-['Figtree:SemiBold',sans-serif] font-semibold left-[826px] opacity-0 text-white top-[836px] translate-x-[-100%] w-[173px]">This is me</p>
    </div>
  );
}

function Details() {
  return (
    <div className="absolute contents left-[610px] top-[767px]" data-name="Details">
      <Group />
      <div className="absolute h-[81.5px] left-[834px] opacity-0 top-[767px] w-[39px]">
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
      <Group2 />
      <p className="absolute font-['Figtree:Regular',sans-serif] font-normal leading-[18px] left-[585px] opacity-70 text-[#c7c1cc] text-[12px] text-nowrap top-[868px] whitespace-pre">Just like the real Max, my digital twin can also make mistakes.</p>
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

function Question() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] max-w-[480px] relative rounded-[12px] shrink-0" data-name="Question">
      <div className="box-border content-stretch flex gap-[10px] items-center justify-center max-w-inherit overflow-clip px-[16px] py-[12px] relative rounded-[inherit]">
        <p className="basis-0 font-['Figtree:Regular',sans-serif] font-normal grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[16px] text-white">Who are you?</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function QuestionContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-end relative shrink-0 w-full" data-name="Question Container">
      <Question />
    </div>
  );
}

function Response() {
  return (
    <div className="bg-[rgba(255,255,255,0)] max-w-[480px] relative rounded-[12px] shrink-0" data-name="Response">
      <div className="box-border content-stretch flex gap-[10px] items-center justify-center max-w-inherit overflow-clip px-[16px] py-[12px] relative rounded-[inherit]">
        <p className="basis-0 font-['Figtree:Regular',sans-serif] font-normal grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[16px] text-white">If you look the URL or in the navbar it should be quite evident that I’m Max? If you mean on a more philosopical level I’d like to explain me as empathetic and curious</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function ResponseContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Response container">
      <Response />
    </div>
  );
}

function Question1() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] max-w-[480px] relative rounded-[12px] shrink-0" data-name="Question">
      <div className="box-border content-stretch flex gap-[10px] items-center justify-center max-w-inherit overflow-clip px-[16px] py-[12px] relative rounded-[inherit]">
        <p className="basis-0 font-['Figtree:Regular',sans-serif] font-normal grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[16px] text-white">That’s a bit rude isn’t it’? I would like to know who you are as a person and professional</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function QuestionContainer1() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-end relative shrink-0 w-full" data-name="Question Container">
      <Question1 />
    </div>
  );
}

function Response1() {
  return (
    <div className="bg-[rgba(255,154,154,0.1)] max-w-[480px] relative rounded-[12px] shrink-0" data-name="Response">
      <div className="box-border content-stretch flex gap-[10px] items-center justify-center max-w-inherit overflow-clip px-[16px] py-[12px] relative rounded-[inherit]">
        <p className="basis-0 font-['Figtree:Regular',sans-serif] font-normal grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[16px] text-white">
          <span>{`Oops! 💸 I have exceeded my OpenAI quota this month (turns out AI isn't free, who knew?). Feel free to reach out to me directly at `}</span>
          <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid underline">max@maxthunberg.com</span>
          <span>{` or connect on `}</span>
          <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid underline">{`LinkedIn `}</span>– he’s not as cheap in person and comes with free coffee! ☕😄
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,154,154,0.5)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function ResponseContainer1() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Response container">
      <Response1 />
    </div>
  );
}

function Content() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-center left-[436px] top-[104px] w-[640px]" data-name="Content">
      <QuestionContainer />
      <ResponseContainer />
      <QuestionContainer1 />
      <ResponseContainer1 />
    </div>
  );
}

export default function FrontPage() {
  return (
    <div className="bg-[#130521] relative size-full" data-name="Front Page">
      <HeroSection />
      <Navbar />
      <Grid />
      <Content />
    </div>
  );
}
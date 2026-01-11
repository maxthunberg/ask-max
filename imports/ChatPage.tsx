import svgPaths from "./svg-gd2tc57jca";

function QuestionContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-end relative shrink-0 w-full" data-name="Question Container">
      <div className="bg-[rgba(255,255,255,0.05)] max-w-[480px] relative rounded-[12px] shrink-0" data-name="User query">
        <div className="box-border content-stretch flex gap-[10px] items-center justify-center max-w-inherit overflow-clip px-[16px] py-[12px] relative rounded-[inherit]">
          <p className="basis-0 font-sans font-normal grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[16px] text-white">That’s a bit rude isn’t it’? I would like to know who you are as a person and professional</p>
        </div>
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      </div>
    </div>
  );
}

function Response() {
  return (
    <div className="bg-[rgba(255,255,255,0)] max-w-[480px] relative rounded-[12px] shrink-0" data-name="Response">
      <div className="content-stretch flex gap-[10px] items-center justify-center max-w-inherit overflow-clip relative rounded-[inherit]">
        <p className="basis-0 font-sans font-normal grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[16px] text-white">If you look the URL or in the navbar it should be quite evident that I’m Max? If you mean on a more philosopical level I’d like to explain me as empathetic and curious</p>
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

function Chat() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-center min-h-px min-w-px relative shrink-0 w-[768px]" data-name="Chat">
      <QuestionContainer />
      <ResponseContainer />
      <div className="content-stretch flex flex-col gap-[10px] items-end relative shrink-0 w-[768px]" data-name="User query">
        <div className="bg-[rgba(255,255,255,0.05)] max-w-[480px] relative rounded-[12px] shrink-0" data-name="Question">
          <div className="box-border content-stretch flex gap-[10px] items-center justify-center max-w-inherit overflow-clip px-[16px] py-[12px] relative rounded-[inherit]">
            <p className="basis-0 font-sans font-normal grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[16px] text-white">That’s a bit rude isn’t it’? I would like to know who you are as a person and professional</p>
          </div>
          <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-[768px]" data-name="Response container">
        <div className="bg-[rgba(255,154,154,0.1)] max-w-[480px] relative rounded-[12px] shrink-0" data-name="Response">
          <div className="box-border content-stretch flex gap-[10px] items-center justify-center max-w-inherit overflow-clip px-[16px] py-[12px] relative rounded-[inherit]">
            <p className="basis-0 font-sans font-normal grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[16px] text-white">
              <span>{`Oops! 💸 I have exceeded my OpenAI quota this month (turns out AI isn't free, who knew?). Feel free to reach out to me directly at `}</span>
              <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid underline">max@maxthunberg.com</span>
              <span>{` or connect on `}</span>
              <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid underline">{`LinkedIn `}</span>– he’s not as cheap in person and comes with free coffee! ☕😄
            </p>
          </div>
          <div aria-hidden="true" className="absolute border border-[rgba(255,154,154,0.5)] border-solid inset-0 pointer-events-none rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}

function PageContent() {
  return (
    <div className="h-[765px] relative shrink-0 w-[1232px]" data-name="Page Content">
      <div className="content-stretch flex flex-col h-[765px] items-center overflow-clip relative rounded-[inherit] w-[1232px]">
        <div className="box-border content-stretch flex gap-[32px] h-[64px] items-center px-[16px] py-[11px] relative shrink-0 w-[1232px]" data-name="Navbar">
          <p className="font-sans font-semibold leading-[24px] relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Max Thunberg</p>
          <div className="content-stretch flex gap-[24px] items-center opacity-80 relative shrink-0" data-name="Links">
            <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Link">
              <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full" data-name="Link Base">
                <p className="font-sans font-normal leading-[24px] relative shrink-0 text-[#c7c1cc] text-[16px] text-nowrap whitespace-pre">Home</p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Link">
              <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full" data-name="Link Base">
                <p className="font-sans font-normal leading-[24px] relative shrink-0 text-[#c7c1cc] text-[16px] text-nowrap whitespace-pre">LinkedIn</p>
              </div>
            </div>
          </div>
        </div>
        <Chat />
        <div className="bg-[#130521] box-border content-stretch flex flex-col gap-[8px] items-start pb-[16px] pt-0 px-0 relative shrink-0 w-[768px]" data-name="Search input">
          <div className="bg-[#21123c] relative rounded-[12px] shrink-0 w-full" data-name="Search input">
            <div aria-hidden="true" className="absolute border border-[#4d4164] border-solid inset-0 pointer-events-none rounded-[12px]" />
            <div className="flex flex-row items-center size-full">
              <div className="box-border content-stretch flex gap-[12px] items-center pl-[12px] pr-[56px] py-[16px] relative w-full">
                <div className="absolute bg-[#7339ff] bottom-[8px] box-border content-stretch flex gap-[12px] items-center justify-center p-[8px] right-[8px] rounded-[8px]" data-name="Button Primary">
                  <div className="relative shrink-0 size-[24px]" data-name="Frame">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                      <g id="Frame">
                        <path d={svgPaths.p35129400} id="Vector" stroke="var(--stroke-0, #F9F6FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </g>
                    </svg>
                  </div>
                </div>
                <p className="absolute font-sans font-normal leading-[24px] left-[12px] opacity-70 text-[#c7c1cc] text-[16px] top-[16px] w-[572px]">Ask me about UX, leadership or whatever you feel like</p>
              </div>
            </div>
          </div>
          <p className="font-sans font-normal leading-[18px] opacity-70 relative shrink-0 text-[#c7c1cc] text-[12px] text-center w-full">Just like the real Max, my digital twin can also make mistakes.</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0px_1px] border-[rgba(255,255,255,0.15)] border-dashed inset-0 pointer-events-none" />
    </div>
  );
}

export default function ChatPage() {
  return (
    <div className="bg-gradient-to-b content-stretch flex flex-col from-[#170641] items-center relative size-full to-[#130521]" data-name="Chat Page">
      <PageContent />
    </div>
  );
}
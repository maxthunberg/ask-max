import svgPaths from "./svg-02ivlyip8t";

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.pc1d6300} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconContainer() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon Container">
      <Icon />
      <div className="bg-[#c4c4c4] h-[20px] opacity-0 shrink-0 w-[8px]" data-name="padding" />
    </div>
  );
}

function Content() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <IconContainer />
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#f6f7fc] text-[16px] text-center text-nowrap whitespace-pre">Button text</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#7339ff] inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content />
    </div>
  );
}

function Default() {
  return (
    <div className="absolute h-[48px] left-[397px] top-[78px] w-[144px]" data-name="Default">
      <Button />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.pc1d6300} fill="var(--fill-0, #F4F8FA)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconContainer1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon Container">
      <Icon1 />
      <div className="bg-[#c4c4c4] h-[20px] opacity-0 shrink-0 w-[8px]" data-name="padding" />
    </div>
  );
}

function Content1() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <IconContainer1 />
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#f6f7fc] text-[16px] text-center text-nowrap whitespace-pre">Button text</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#8755ff] inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content1 />
    </div>
  );
}

function Hover() {
  return (
    <div className="absolute h-[48px] left-[397px] top-[174px] w-[144px]" data-name="Hover">
      <Button1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.pc1d6300} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconContainer2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon Container">
      <Icon2 />
      <div className="bg-[#c4c4c4] h-[20px] opacity-0 shrink-0 w-[8px]" data-name="padding" />
    </div>
  );
}

function Content2() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <IconContainer2 />
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#f6f7fc] text-[16px] text-center text-nowrap whitespace-pre">Button text</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#7339ff] inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content2 />
    </div>
  );
}

function Active() {
  return (
    <div className="absolute h-[48px] left-[397px] top-[270px] w-[144px]" data-name="Active">
      <Button2 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.pc1d6300} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconContainer3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon Container">
      <Icon3 />
      <div className="bg-[#c4c4c4] h-[20px] opacity-0 shrink-0 w-[8px]" data-name="padding" />
    </div>
  );
}

function Content3() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <IconContainer3 />
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#f6f7fc] text-[16px] text-center text-nowrap whitespace-pre">Button text</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#7339ff] border border-[#7339ff] border-solid inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content3 />
      <div className="absolute inset-0 rounded-[4px]" data-name=":focus">
        <div aria-hidden="true" className="absolute border-2 border-[#f4ccfd] border-solid inset-[-2px] pointer-events-none rounded-[6px]" />
      </div>
    </div>
  );
}

function Focus() {
  return (
    <div className="absolute h-[48px] left-[397px] top-[366px] w-[144px]" data-name="Focus">
      <Button3 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.pc1d6300} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconContainer4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon Container">
      <Icon4 />
      <div className="bg-[#c4c4c4] h-[20px] opacity-0 shrink-0 w-[8px]" data-name="padding" />
    </div>
  );
}

function Content4() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <IconContainer4 />
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#f6f7fc] text-[16px] text-center text-nowrap whitespace-pre">Button text</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#7339ff] inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content4 />
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute inset-0 opacity-30" data-name="Button">
      <Button4 />
    </div>
  );
}

function Disabled() {
  return (
    <div className="absolute h-[48px] left-[397px] top-[462px] w-[144px]" data-name="Disabled">
      <Button5 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.pc1d6300} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconContainer5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon Container">
      <div className="bg-[#c4c4c4] h-[20px] opacity-0 shrink-0 w-[8px]" data-name="padding" />
      <Icon5 />
    </div>
  );
}

function Content5() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#f6f7fc] text-[16px] text-center text-nowrap whitespace-pre">Button text</p>
      <IconContainer5 />
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#7339ff] inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content5 />
    </div>
  );
}

function Default1() {
  return (
    <div className="absolute h-[48px] left-[644px] top-[78px] w-[144px]" data-name="Default">
      <Button6 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.pc1d6300} fill="var(--fill-0, #F4F8FA)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconContainer6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon Container">
      <div className="bg-[#c4c4c4] h-[20px] opacity-0 shrink-0 w-[8px]" data-name="padding" />
      <Icon6 />
    </div>
  );
}

function Content6() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#f6f7fc] text-[16px] text-center text-nowrap whitespace-pre">Button text</p>
      <IconContainer6 />
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#8755ff] inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content6 />
    </div>
  );
}

function Hover1() {
  return (
    <div className="absolute h-[48px] left-[644px] top-[174px] w-[144px]" data-name="Hover">
      <Button7 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.pc1d6300} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconContainer7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon Container">
      <div className="bg-[#c4c4c4] h-[20px] opacity-0 shrink-0 w-[8px]" data-name="padding" />
      <Icon7 />
    </div>
  );
}

function Content7() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#f6f7fc] text-[16px] text-center text-nowrap whitespace-pre">Button text</p>
      <IconContainer7 />
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#7339ff] inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content7 />
    </div>
  );
}

function Active1() {
  return (
    <div className="absolute h-[48px] left-[644px] top-[270px] w-[144px]" data-name="Active">
      <Button8 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.pc1d6300} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconContainer8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon Container">
      <div className="bg-[#c4c4c4] h-[20px] opacity-0 shrink-0 w-[8px]" data-name="padding" />
      <Icon8 />
    </div>
  );
}

function Content8() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#f6f7fc] text-[16px] text-center text-nowrap whitespace-pre">Button text</p>
      <IconContainer8 />
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#7339ff] border border-[#7339ff] border-solid inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content8 />
      <div className="absolute inset-0 rounded-[4px]" data-name=":focus">
        <div aria-hidden="true" className="absolute border-2 border-[#f4ccfd] border-solid inset-[-2px] pointer-events-none rounded-[6px]" />
      </div>
    </div>
  );
}

function Focus1() {
  return (
    <div className="absolute h-[48px] left-[644px] top-[366px] w-[144px]" data-name="Focus">
      <Button9 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.pc1d6300} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconContainer9() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon Container">
      <div className="bg-[#c4c4c4] h-[20px] opacity-0 shrink-0 w-[8px]" data-name="padding" />
      <Icon9 />
    </div>
  );
}

function Content9() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#f6f7fc] text-[16px] text-center text-nowrap whitespace-pre">Button text</p>
      <IconContainer9 />
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#7339ff] inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content9 />
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute inset-0 opacity-30" data-name="Button">
      <Button10 />
    </div>
  );
}

function Disabled1() {
  return (
    <div className="absolute h-[48px] left-[644px] top-[462px] w-[144px]" data-name="Disabled">
      <Button11 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.pc1d6300} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconContainer10() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon Container">
      <Icon10 />
    </div>
  );
}

function Content10() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <IconContainer10 />
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#7339ff] inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content10 />
    </div>
  );
}

function Default2() {
  return (
    <div className="absolute left-[891px] size-[48px] top-[78px]" data-name="Default">
      <Button12 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.pc1d6300} fill="var(--fill-0, #F4F8FA)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconContainer11() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon Container">
      <Icon11 />
    </div>
  );
}

function Content11() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <IconContainer11 />
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#8755ff] inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content11 />
    </div>
  );
}

function Hover2() {
  return (
    <div className="absolute left-[891px] size-[48px] top-[174px]" data-name="Hover">
      <Button13 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.pc1d6300} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconContainer12() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon Container">
      <Icon12 />
    </div>
  );
}

function Content12() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <IconContainer12 />
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#7339ff] inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content12 />
    </div>
  );
}

function Active2() {
  return (
    <div className="absolute left-[891px] size-[48px] top-[270px]" data-name="Active">
      <Button14 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.pc1d6300} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconContainer13() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon Container">
      <Icon13 />
    </div>
  );
}

function Content13() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <IconContainer13 />
    </div>
  );
}

function Button15() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#7339ff] border border-[#7339ff] border-solid inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content13 />
      <div className="absolute inset-0 rounded-[4px]" data-name=":focus">
        <div aria-hidden="true" className="absolute border-2 border-[#f4ccfd] border-solid inset-[-2px] pointer-events-none rounded-[6px]" />
      </div>
    </div>
  );
}

function Focus2() {
  return (
    <div className="absolute left-[891px] size-[48px] top-[366px]" data-name="Focus">
      <Button15 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.pc1d6300} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconContainer14() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon Container">
      <Icon14 />
    </div>
  );
}

function Content14() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <IconContainer14 />
    </div>
  );
}

function Button16() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#7339ff] inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content14 />
    </div>
  );
}

function Button17() {
  return (
    <div className="absolute inset-0 opacity-30" data-name="Button">
      <Button16 />
    </div>
  );
}

function Disabled2() {
  return (
    <div className="absolute left-[891px] size-[48px] top-[462px]" data-name="Disabled">
      <Button17 />
    </div>
  );
}

function Content15() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#f6f7fc] text-[16px] text-center text-nowrap whitespace-pre">Button text</p>
    </div>
  );
}

function Button18() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#7339ff] inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content15 />
    </div>
  );
}

function Default3() {
  return (
    <div className="absolute h-[48px] left-[178px] top-[78px] w-[112px]" data-name="Default">
      <Button18 />
    </div>
  );
}

function Content16() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#f6f7fc] text-[16px] text-center text-nowrap whitespace-pre">Button text</p>
    </div>
  );
}

function Button19() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#8755ff] inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content16 />
    </div>
  );
}

function Hover3() {
  return (
    <div className="absolute h-[48px] left-[178px] top-[174px] w-[112px]" data-name="Hover">
      <Button19 />
    </div>
  );
}

function Content17() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#f6f7fc] text-[16px] text-center text-nowrap whitespace-pre">Button text</p>
    </div>
  );
}

function Button20() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#7339ff] inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content17 />
    </div>
  );
}

function Active3() {
  return (
    <div className="absolute h-[48px] left-[178px] top-[270px] w-[112px]" data-name="Active">
      <Button20 />
    </div>
  );
}

function Content18() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#f6f7fc] text-[16px] text-center text-nowrap whitespace-pre">Button text</p>
    </div>
  );
}

function Button21() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#7339ff] border border-[#7339ff] border-solid inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content18 />
      <div className="absolute inset-0 rounded-[4px]" data-name=":focus">
        <div aria-hidden="true" className="absolute border-2 border-[#f4ccfd] border-solid inset-[-2px] pointer-events-none rounded-[6px]" />
      </div>
    </div>
  );
}

function Focus3() {
  return (
    <div className="absolute h-[48px] left-[178px] top-[366px] w-[112px]" data-name="Focus">
      <Button21 />
    </div>
  );
}

function Content19() {
  return (
    <div className="absolute content-stretch flex items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#f6f7fc] text-[16px] text-center text-nowrap whitespace-pre">Button text</p>
    </div>
  );
}

function Button22() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Button">
      <div className="absolute bg-[#7339ff] inset-0 rounded-[4px]" data-name="Button Bg" />
      <Content19 />
    </div>
  );
}

function Button23() {
  return (
    <div className="absolute inset-0 opacity-30" data-name="Button">
      <Button22 />
    </div>
  );
}

function Disabled3() {
  return (
    <div className="absolute h-[48px] left-[178px] top-[462px] w-[112px]" data-name="Disabled">
      <Button23 />
    </div>
  );
}

export default function Buttons() {
  return (
    <div className="bg-gradient-to-b border-[0px_0px_1px] border-[rgba(255,255,255,0.15)] border-dashed from-[#170641] relative size-full to-[#130521]" data-name="Buttons">
      <Default />
      <Hover />
      <Active />
      <Focus />
      <Disabled />
      <Default1 />
      <Hover1 />
      <Active1 />
      <Focus1 />
      <Disabled1 />
      <Default2 />
      <Hover2 />
      <Active2 />
      <Focus2 />
      <Disabled2 />
      <Default3 />
      <Hover3 />
      <Active3 />
      <Focus3 />
      <Disabled3 />
      <p className="absolute font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] left-[78px] text-[16px] text-center text-nowrap text-white top-[90px] translate-x-[-50%] whitespace-pre">Default</p>
      <p className="absolute font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] left-[78.5px] text-[16px] text-center text-nowrap text-white top-[180px] translate-x-[-50%] whitespace-pre">Hover</p>
      <p className="absolute font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] left-[78px] text-[16px] text-center text-nowrap text-white top-[282px] translate-x-[-50%] whitespace-pre">Active</p>
      <p className="absolute font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] left-[78px] text-[16px] text-center text-nowrap text-white top-[378px] translate-x-[-50%] whitespace-pre">Focus</p>
      <p className="absolute font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] left-[78.5px] text-[16px] text-center text-nowrap text-white top-[468px] translate-x-[-50%] whitespace-pre">Disabled</p>
    </div>
  );
}
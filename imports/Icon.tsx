import svgPaths from "./svg-ofmuakclg1";

function Frame() {
  return (
    <div className="absolute left-[12px] size-[24px] top-[12px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p12dea100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

export default function Icon() {
  return (
    <div className="relative size-full" data-name="Icon">
      <div className="absolute border border-[#4d4164] border-solid left-0 rounded-[12px] size-[48px] top-0" />
      <Frame />
    </div>
  );
}
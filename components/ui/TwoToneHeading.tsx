export default function TwoToneHeading({
  text,
  accentClassName = 'text-accent-500',
}: {
  text: string;
  accentClassName?: string;
}) {
  const words = text.trim().split(' ');
  const lastWord = words.pop() ?? '';
  const rest = words.join(' ');

  return (
    <>
      {rest && `${rest} `}
      <span className={accentClassName}>{lastWord}</span>
    </>
  );
}

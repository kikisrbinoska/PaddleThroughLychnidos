export interface WordmarkProps {
  className?: string;
}

export function Wordmark({ className = "" }: WordmarkProps) {
  return (
    <h1
      className={`bg-gradient-to-r from-primary-900 to-secondary-900 bg-clip-text text-3xl font-extrabold leading-tight text-transparent ${className}`}
    >
      Paddle through Lychnidos
    </h1>
  );
}

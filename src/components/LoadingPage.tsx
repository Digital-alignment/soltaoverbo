export default function LoadingPage() {
  return (
    <div className="fixed inset-0 bg-paper flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
          <img
            src="/icone.svg"
            alt="Solta o Verbo"
            className="w-full h-full animate-spin-slow"
          />
        </div>
        <p className="mt-8 text-darkNeutral/70 text-sm sm:text-base font-medium">
          Carregando...
        </p>
      </div>
    </div>
  );
}

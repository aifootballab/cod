interface LoginPageProps {
  onBack: () => void;
  onLogin: () => void;
}

export function LoginPage({ onBack }: LoginPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <button onClick={onBack} className="px-4 py-2 bg-orange-600 rounded">
          Back
        </button>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/dashboard/home');
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: 'url(/src/public/image/BG.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <header className="px-6 py-4">
        <img
          src="/src/public/image/favicon.svg"
          alt="Famroot"
          className="h-10 w-10"
        />
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to Famroot
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your family connection hub
          </p>
          <button
            onClick={handleEnter}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </main>

      <footer className="px-6 py-4 text-center text-gray-600">
        <p>famroot@2025</p>
      </footer>
    </div>
  );
}

export default Landing;

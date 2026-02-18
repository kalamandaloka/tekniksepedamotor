import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success && result.user) {
      const role = result.user.role;
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'guru') {
        navigate('/guru');
      } else {
        navigate('/siswa');
      }
    } else {
      setError(result.error || 'Login gagal');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black">
      {/* Background with Blur */}
      <div className="absolute inset-0 bg-[url('/images/global/coverlogin.png')] bg-cover bg-center blur-xl opacity-30 scale-110"></div>
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Login Card Container */}
      <div className="relative z-10 w-full max-w-6xl bg-nalar-dark/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-white/10 min-h-[600px] lg:h-[80vh]">
        
        {/* Left Side - Image Background */}
        <div 
            className="w-full lg:w-1/2 relative bg-black/50 overflow-hidden bg-[url('/images/global/coverlogin.png')] bg-cover bg-center bg-no-repeat group"
        >
            {/* Gradient Overlay for Text Readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
            
            {/* Hover Effect - Zoom */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-500 hover:bg-black/10"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-nalar-dark/50">
            <div className="w-full max-w-sm mx-auto space-y-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Login Pengguna</h2>
                    <div className="h-1 w-20 bg-nalar-primary rounded-full"></div>
                    <p className="text-gray-400 text-sm pt-2">Pembelajaran Interaktif Teknik Sepeda Motor</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm text-center">
                        {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 block">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-lg focus:ring-nalar-accent focus:border-nalar-accent block p-3.5 transition-colors outline-none placeholder-gray-500"
                                placeholder="Masukkan username"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 block">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-lg focus:ring-nalar-accent focus:border-nalar-accent block p-3.5 transition-colors outline-none placeholder-gray-500"
                                placeholder="Masukkan password"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" type="checkbox" className="w-4 h-4 text-nalar-primary bg-black/40 border-gray-600 rounded focus:ring-nalar-primary ring-offset-gray-800" />
                            <label htmlFor="remember-me" className="ml-2 text-sm font-medium text-gray-400">Ingat Saya</label>
                        </div>
                        <a href="#" className="text-sm font-medium text-nalar-accent hover:underline hover:text-nalar-accent/80">Lupa Password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-nalar-dark bg-gradient-to-r from-nalar-primary to-nalar-accent hover:from-nalar-accent hover:to-nalar-primary font-bold rounded-lg text-sm px-5 py-3.5 text-center shadow-lg hover:shadow-xl hover:shadow-nalar-primary/20 transition-all duration-300 transform active:scale-[0.98]"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-t-2 border-nalar-dark rounded-full animate-spin"></div>
                                <span>Memproses...</span>
                            </div>
                        ) : (
                            "LOGIN"
                        )}
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

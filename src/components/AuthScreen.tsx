import { useState } from 'react';
import { CheckSquare, Mail, Lock, ArrowRight, Sparkles, Calendar, BarChart3, Bot } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Spinner } from '@/components/ui';

type Mode = 'login' | 'signup' | 'reset';

export function AuthScreen() {
  const { signIn, signUp, resetPassword } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'E-mail é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'E-mail inválido';
    if (mode !== 'reset' && !password) e.password = 'Senha é obrigatória';
    else if (mode !== 'reset' && password.length < 6) e.password = 'Mínimo de 6 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          showToast(error === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error, 'error');
        } else {
          showToast('Bem-vindo de volta!', 'success');
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password);
        if (error) {
          showToast(error === 'User already registered' ? 'Este e-mail já está cadastrado.' : error, 'error');
        } else {
          showToast('Conta criada com sucesso! Bem-vindo!', 'success');
        }
      } else {
        const { error } = await resetPassword(email);
        if (error) showToast(error, 'error');
        else showToast('E-mail de recuperação enviado!', 'success');
        setMode('login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-600 via-green-700 to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <CheckSquare className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">TaskFlow</h1>
              <p className="text-white/70 text-sm">Gestão inteligente de tarefas</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Organize seu dia.<br />Conquiste suas metas.
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-md">
            Um assistente de produtividade completo que ajuda você a priorizar, planejar e executar suas tarefas com inteligência.
          </p>
          <div className="space-y-4">
            {[
              { icon: Sparkles, text: 'Assistente IA para sugerir prioridades e organizar seu dia' },
              { icon: Calendar, text: 'Calendário e planejador diário com arrastar e soltar' },
              { icon: BarChart3, text: 'Análises de produtividade com gráficos detalhados' },
              { icon: Bot, text: 'Divisão automática de tarefas em subtarefas' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center gap-3 text-white/90">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm">{f.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-violet-600 flex items-center justify-center">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">TaskFlow</h1>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Criar conta' : 'Recuperar senha'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {mode === 'login' ? 'Acesse sua conta para continuar' : mode === 'signup' ? 'Comece a organizar suas tarefas hoje' : 'Enviaremos um link para seu e-mail'}
          </p>

          <div className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="email"
                  className="input pl-11"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {mode !== 'reset' && (
              <div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="password"
                    className="input pl-11"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                  />
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full py-3">
              {loading ? <Spinner className="h-5 w-5" /> : (
                <>
                  {mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Criar conta' : 'Enviar link'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {mode === 'login' && (
              <>
                <button onClick={() => setMode('reset')} className="text-green-600 dark:text-green-400 hover:underline">
                  Esqueceu sua senha?
                </button>
                <p className="mt-3">
                  Não tem conta?{' '}
                  <button onClick={() => setMode('signup')} className="text-green-600 dark:text-green-400 font-medium hover:underline">
                    Cadastre-se
                  </button>
                </p>
              </>
            )}
            {mode === 'signup' && (
              <p>
                Já tem conta?{' '}
                <button onClick={() => setMode('login')} className="text-green-600 dark:text-green-400 font-medium hover:underline">
                  Entrar
                </button>
              </p>
            )}
            {mode === 'reset' && (
              <p>
                <button onClick={() => setMode('login')} className="text-green-600 dark:text-green-400 font-medium hover:underline">
                  Voltar para login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

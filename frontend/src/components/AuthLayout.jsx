import { Outlet, Link } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen gradient-surface flex items-center justify-center px-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-ink-900 text-white p-10 shadow-soft flex flex-col justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-ink-200">TaskFlow</p>
            <h1 className="font-display text-3xl mt-6">Bring structure to your day.</h1>
            <p className="text-ink-200 mt-4">
              A focused workspace inspired by Microsoft To Do with Odoo-style clarity.
            </p>
          </div>
          <div className="mt-12">
            <Link to="/" className="text-ink-200 text-sm">
              Go to dashboard
            </Link>
          </div>
        </div>
        <div className="rounded-3xl glass p-8 shadow-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

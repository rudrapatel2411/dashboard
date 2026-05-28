import React from 'react';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

const AuthLayout = ({ children, isLoading, toast, pageTitle, pageSubtitle }) => {
  return (
    <div className="auth-root">

      {/* Left decorative panel — mirrors sidebar style */}
      <div className="auth-panel">
        <div className="auth-panel-glow auth-panel-glow-1" />
        <div className="auth-panel-glow auth-panel-glow-2" />

        <div className="auth-panel-content">
          {/* Brand */}
          <div className="auth-panel-brand">
            <div className="auth-panel-brand-icon">S</div>
            <span className="auth-panel-brand-name">
              Sport<span className="auth-panel-brand-accent">Sphere</span>
            </span>
          </div>

          {/* Tagline */}
          <div className="auth-panel-tagline relative">
            <h2 className="auth-panel-headline">
              Track. Analyze.<br />
              <span className="auth-panel-headline-accent">Conquer.</span>
            </h2>
            <p className="auth-panel-desc">
              The all-in-one platform for elite sports performance management, team analytics, and athlete progress tracking.
            </p>
          </div>

          {/* Feature pills */}
          <div className="auth-panel-pills">
            {['Performance Metrics', 'Team Analytics', 'Test Scheduling', 'Progress Reports'].map(f => (
              <span key={f} className="auth-pill">
                <Activity size={11} />
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-wrap">

          {/* Mobile brand (hidden on desktop) */}
          <div className="auth-mobile-brand">
            <div className="auth-panel-brand-icon">S</div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
              Sport<span style={{ color: '#F97316' }}>Sphere</span>
            </span>
          </div>

          {/* Card */}
          <div className="auth-card overflow-y-auto">
            {/* Card top accent bar */}
            <div className="auth-card-bar" />

            <div className="auth-card-inner">
              <div className="auth-card-header">
                <h1 className="auth-title">{pageTitle}</h1>
                {pageSubtitle && <p className="auth-subtitle">{pageSubtitle}</p>}
              </div>

              <div className="auth-card-body">
                {children}
              </div>

              {/* Loading bar */}
              {isLoading && (
                <div className="auth-progress-bar">
                  <div className="auth-progress-fill" />
                </div>
              )}
            </div>
          </div>

          <p className="auth-footer">
            © {new Date().getFullYear()} SportSphere Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* Toast */}
      {toast?.show && (
        <div className={`auth-toast ${toast.isError ? 'auth-toast-error' : 'auth-toast-success'}`}>
          <div className={`auth-toast-icon-wrap ${toast.isError ? 'auth-toast-icon-error' : 'auth-toast-icon-success'}`}>
            {toast.isError ? <ShieldAlert size={17} /> : <CheckCircle2 size={17} />}
          </div>
          <div>
            <p className="auth-toast-title">{toast.title}</p>
            <p className="auth-toast-msg">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthLayout;

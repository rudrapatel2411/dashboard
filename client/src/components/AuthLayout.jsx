import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import sportsPattern from '../assets/auth-sports-pattern.svg';

const AuthLayout = ({ children, isLoading, toast, pageTitle, pageSubtitle }) => {
  return (
    <div className="auth-root">

      {/* Left decorative panel — mirrors sidebar style */}
      <div className="auth-panel">
        <div
          className="auth-sports-pattern"
          style={{ backgroundImage: `url(${sportsPattern})` }}
          aria-hidden="true"
        />
        <div className="auth-sports-vignette" aria-hidden="true" />

        <div className="auth-panel-content auth-panel-content-sports">
          <div className="auth-brand-plate">
            <div className="auth-panel-brand">
              <div className="auth-panel-brand-icon">S</div>
              <span className="auth-panel-brand-name">
                Sport<span className="auth-panel-brand-accent">Sphere</span>
              </span>
            </div>
            <p className="auth-panel-desc">
              Government-ready sports screening and performance management portal.
            </p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-wrap">

          {/* Mobile brand (hidden on desktop) */}
          <div className="auth-mobile-brand">
            <div className="auth-panel-brand-icon">S</div>
            <span className="auth-mobile-brand-name">
              Sport<span className="auth-mobile-brand-accent">Sphere</span>
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

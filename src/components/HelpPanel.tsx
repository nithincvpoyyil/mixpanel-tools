export function HelpPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="help-panel">
      <div className="help-content">
        <div className="help-topbar">
          <span className="help-topbar-title">Help</span>
          <button className="help-close-btn" onClick={onClose} title="Back to events">
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Close
          </button>
        </div>

        <section className="help-section">
          <h2 className="help-heading">Self-hosted Mixpanel proxy</h2>

          <h3 className="help-subheading">What is it?</h3>
          <p className="help-body">
            By default, Mixpanel Tools captures network requests sent to{' '}
            <code className="help-code">api.mixpanel.com</code>. If your product routes
            analytics events through its own proxy or backend (to avoid ad-blockers, add
            server-side enrichment, or control data residency), those requests will be
            silently ignored unless you tell the extension where to look.
          </p>
          <p className="help-body">
            The <strong>Self-hosted URL</strong> field lets you provide the base URL of
            that proxy. Any network request whose URL contains that string will be
            captured and shown alongside standard Mixpanel events.
          </p>

          <h3 className="help-subheading">How to enable</h3>
          <ol className="help-steps">
            <li>Open your site in Chrome and launch DevTools (<kbd>F12</kbd>).</li>
            <li>Switch to the <strong>Mixpanel Tools</strong> panel.</li>
            <li>
              In the toolbar input (the gear icon field), type your proxy base URL —
              for example{' '}
              <code className="help-code">http://localhost:8080/mp</code> or{' '}
              <code className="help-code">https://analytics.example.com/track</code>.
            </li>
            <li>
              Trigger any event on the page. Matching requests appear in the{' '}
              <strong>Events</strong> list immediately.
            </li>
          </ol>
          <p className="help-note">
            Matching is by <strong>substring</strong>, not a regular expression — the
            URL just needs to contain the string you entered.
          </p>

          <h3 className="help-subheading">How preferences are stored</h3>
          <p className="help-body">
            Both the proxy URL and the theme preference are persisted using{' '}
            <code className="help-code">chrome.storage.sync</code>. This means:
          </p>
          <ul className="help-list">
            <li>
              Settings survive closing and re-opening DevTools — you only need to
              enter the URL once.
            </li>
            <li>
              If you are signed into Chrome, settings sync across your devices
              automatically.
            </li>
            <li>
              To clear the URL, simply delete the text in the toolbar input and press
              Enter.
            </li>
          </ul>
        </section>

        <section className="help-section">
          <h2 className="help-heading">Theme</h2>
          <p className="help-body">
            Click the <strong>Light / Dark / Auto</strong> button in the toolbar to
            cycle between themes. <em>Auto</em> follows your OS or browser preference
            via{' '}
            <code className="help-code">prefers-color-scheme</code>.
            The chosen theme is saved in{' '}
            <code className="help-code">chrome.storage.sync</code> and restored on
            next open.
          </p>
        </section>

      </div>
    </div>
  );
}

import { NextResponse } from 'next/server'

const facebookPopupHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Facebook Login</title>
    <style>
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        min-height: 100%;
        background: #eef2f7;
        color: #1c1e21;
        font-family: Helvetica, Arial, sans-serif;
      }
      button, input { font: inherit; }
      .window {
        min-height: 100vh;
        background:
          linear-gradient(135deg, rgba(255,255,255,.82), rgba(238,242,247,.96)),
          #eef2f7;
      }
      .titlebar {
        height: 32px;
        background: #111827;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        font-size: 12px;
      }
      .titlebar-left {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .mini-logo {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        background: #1877f2;
        color: #ffffff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
        flex: 0 0 auto;
      }
      .title-lines { min-width: 0; line-height: 1; }
      .title-lines p {
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .title-lines .subtitle {
        margin-top: 2px;
        color: rgba(255,255,255,.6);
        font-size: 10px;
      }
      .close {
        border: 0;
        background: transparent;
        color: rgba(255,255,255,.85);
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
        padding: 2px 6px;
      }
      .shell {
        min-height: calc(100vh - 32px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 34px 34px 28px;
      }
      .panel {
        width: min(100%, 520px);
        min-height: auto;
        background: transparent;
        box-shadow: none;
        padding: 26px 0 0;
        position: relative;
      }
      .brand {
        display: flex;
        justify-content: center;
        margin: 0 0 70px;
      }
      .brand-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #1877f2;
        color: #ffffff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 52px;
        font-weight: 700;
        line-height: 1;
        font-family: Helvetica, Arial, sans-serif;
        transform: translateX(1px);
      }
      .field {
        width: 100%;
        height: 56px;
        margin: 0 0 12px;
        border: 1px solid #e7ebf0;
        border-radius: 16px;
        padding: 0 18px;
        color: #98a0aa;
        font-size: 16px;
        font-weight: 500;
        outline: none;
        background: #ffffff;
        box-shadow: 0 0 0 1px rgba(243,245,247,.86) inset;
      }
      .field::placeholder {
        color: #98a0aa;
      }
      .login-btn {
        width: 100%;
        height: 46px;
        margin: 8px 0 24px;
        border: 0;
        border-radius: 999px;
        background: #1778f2;
        color: #ffffff;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
      }
      .forgot {
        display: block;
        margin: 0 0 102px;
        text-align: center;
        color: #565b63;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
      }
      .create-wrap {
        margin: 0;
      }
      .create-btn {
        width: 100%;
        height: 44px;
        border: 1.5px solid #8fc5ff;
        border-radius: 999px;
        background: #ffffff;
        color: #6caeea;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
      }
      .meta {
        margin-top: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        color: #14171a;
        font-size: 14px;
        font-weight: 500;
      }
      .meta-icon {
        width: 22px;
        height: 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .meta-icon svg {
        width: 22px;
        height: 22px;
        display: block;
      }
    </style>
  </head>
  <body>
    <div class="window">
      <div class="titlebar">
        <div class="titlebar-left">
          <span class="mini-logo">f</span>
          <div class="title-lines">
            <p>Facebook Login - Google Chrome</p>
            <p class="subtitle">www.facebook.com/login</p>
          </div>
        </div>
        <button class="close" type="button" aria-label="Close window" onclick="window.close()">×</button>
      </div>

      <div class="shell">
        <div class="panel">
          <div class="brand"><div class="brand-icon">f</div></div>
          <input class="field" type="text" placeholder="Email" />
          <input class="field" type="password" placeholder="Password" />
          <button id="facebook-login" class="login-btn" type="button">Log in</button>
          <a class="forgot" href="javascript:void(0)">Forgot password?</a>
          <div class="create-wrap">
            <button class="create-btn" type="button">Create new account</button>
          </div>
          <div class="meta">
            <span class="meta-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3.9 15.4c0-4.1 2.8-7.4 6.3-7.4 2 0 3.7 1.1 4.7 2.8.8-1.7 2.5-2.8 4.5-2.8 2.6 0 4.7 2.1 4.7 4.8 0 2.8-2.4 5.1-5.4 5.1h-1.7v-2.6h1.2c1.6 0 2.8-1.1 2.8-2.5 0-1.3-.9-2.3-2.2-2.3-1.6 0-2.8 1.4-2.8 3.3v4.1h-2.6v-4.1c0-1.9-1.2-3.3-2.8-3.3-2 0-3.7 2.2-3.7 4.8 0 2.6 1.7 4.8 3.7 4.8H13v2.5h-1.7c-4.1 0-7.4-3.2-7.4-7.2Z" fill="#111111"></path>
              </svg>
            </span>
            <span>Meta</span>
          </div>
        </div>
      </div>
    </div>

    <script>
      const notifyFacebookConnected = (message) => {
        const payload = {
          type: 'CHANNEL_CONNECTED',
          platformId: 'facebook',
          status: 'success',
          connectedCount: 1,
          connectedLabel: 'trang',
          message,
        };

        if (window.opener) {
          window.opener.postMessage(payload, window.location.origin);
        }

        setTimeout(() => window.close(), 250);
      };

      document.getElementById('facebook-login')?.addEventListener('click', () => {
        notifyFacebookConnected('Facebook đã được kết nối thành công.');
      });
    </script>
  </body>
</html>`

export async function GET() {
  return new NextResponse(facebookPopupHtml, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  })
}

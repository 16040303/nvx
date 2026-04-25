import { NextResponse } from 'next/server'

const instagramPopupHtml = `<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Đăng nhập Instagram</title>
    <style>
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        min-height: 100%;
        background: #ffffff;
        color: #262626;
        font-family: Helvetica, Arial, sans-serif;
      }
      button, input { font: inherit; }
      .window {
        min-height: 100vh;
        background: linear-gradient(180deg, #fff8fb 0%, #ffffff 40%, #fffaf6 100%);
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
        background: linear-gradient(135deg, #f9ce34 0%, #ee2a7b 48%, #6228d7 100%);
        color: #ffffff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
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
        width: min(752px, 100%);
        margin: 0 auto;
        padding: 8px 0 0;
      }
      .panel {
        width: 100%;
        padding: 0 0 22px;
        background: transparent;
      }
      .brand {
        display: flex;
        justify-content: center;
        margin: 28px 0 24px;
      }
      .brand-icon {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        border: 2.2px solid #ff3d78;
        position: relative;
        box-shadow: inset 0 0 0 2.2px #ff9a3d;
      }
      .brand-icon::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 16px;
        height: 16px;
        border: 2.2px solid #7d3cff;
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }
      .brand-icon::after {
        content: '';
        position: absolute;
        right: 8px;
        top: 8px;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #7d3cff;
      }
      .field {
        width: calc(100% - 64px);
        height: 38px;
        margin: 0 32px 8px;
        border: 1px solid #dbdbdb;
        border-radius: 4px;
        padding: 0 12px;
        color: #8e8e8e;
        font-size: 11px;
        outline: none;
        background: #fafafa;
      }
      .field::placeholder {
        color: #8e8e8e;
      }
      .login-btn {
        width: calc(100% - 64px);
        height: 32px;
        margin: 8px 32px 10px;
        border: 0;
        border-radius: 4px;
        background: #1877f2;
        color: #ffffff;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
      }
      .forgot {
        display: block;
        margin: 0 0 44px;
        text-align: center;
        color: #262626;
        font-size: 8px;
        text-decoration: none;
      }
      .create-wrap {
        margin: 0 32px;
      }
      .create-btn {
        width: 100%;
        height: 34px;
        border: 1px solid #dbdbdb;
        border-radius: 4px;
        background: #ffffff;
        color: #8e8e8e;
        font-size: 9px;
        font-weight: 600;
        cursor: pointer;
      }
      .footer {
        margin-top: 18px;
        text-align: center;
        color: #8e8e8e;
        font-size: 8px;
        letter-spacing: .04em;
      }
    </style>
  </head>
  <body>
    <div class="window">
      <div class="titlebar">
        <div class="titlebar-left">
          <span class="mini-logo">I</span>
          <div class="title-lines">
            <p>Đăng nhập Instagram - Google Chrome</p>
            <p class="subtitle">www.instagram.com/accounts/login</p>
          </div>
        </div>
        <button class="close" type="button" aria-label="Đóng cửa sổ" onclick="window.close()">×</button>
      </div>

      <div class="shell">
        <div class="panel">
          <div class="brand"><div class="brand-icon" aria-hidden="true"></div></div>
          <input class="field" type="text" placeholder="Username, mobile number or email" />
          <input class="field" type="password" placeholder="Password" />
          <button id="instagram-login" class="login-btn" type="button">Log in</button>
          <a class="forgot" href="javascript:void(0)">Forgot password?</a>
          <div class="create-wrap">
            <button class="create-btn" type="button">Create new account</button>
          </div>
          <div class="footer">FROM META</div>
        </div>
      </div>
    </div>

    <script>
      const notifyInstagramConnected = (message) => {
        const payload = {
          type: 'CHANNEL_CONNECTED',
          platformId: 'instagram',
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

      document.getElementById('instagram-login')?.addEventListener('click', () => {
        notifyInstagramConnected('Instagram đã được kết nối thành công.');
      });
    </script>
  </body>
</html>`

export async function GET() {
  return new NextResponse(instagramPopupHtml, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  })
}

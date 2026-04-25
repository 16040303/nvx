import { NextResponse } from 'next/server'

const shopeePopupHtml = `<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Đăng nhập đến Shopee</title>
    <style>
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        min-height: 100%;
        background: #ffffff;
        color: #222222;
        font-family: Arial, Helvetica, sans-serif;
      }
      button, input { font: inherit; }
      .window {
        min-height: 100vh;
        background: #ee4d2d;
      }
      .titlebar {
        height: 32px;
        background: #000000;
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
        border-radius: 3px;
        background: #ee4d2d;
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
      .content {
        max-width: 564px;
        margin: 0 auto;
        padding: 17px 17px 18px;
      }
      .card {
        width: 100%;
        min-height: 518px;
        background: #ffffff;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
        padding: 28px 36px 26px;
      }
      .view { display: none; }
      .view.is-active { display: block; }
      .header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 26px;
      }
      .title,
      .qr-title {
        margin: 10px 0 0;
        color: #222222;
        font-size: 26px;
        font-weight: 400;
        line-height: 1.22;
        letter-spacing: 0;
      }
      .switch-wrap {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-left: 20px;
        flex-shrink: 0;
      }
      .switch-badge {
        position: relative;
        max-width: 125px;
        border: 2px solid #ffbf00;
        border-radius: 2px;
        background: #fefaec;
        color: #ffbf00;
        font-size: 14px;
        font-weight: 700;
        line-height: 1.25;
        text-align: left;
        padding: 11px 14px;
        margin-right: 16px;
        cursor: pointer;
        box-sizing: border-box;
      }
      .switch-badge::after {
        content: '';
        position: absolute;
        top: 50%;
        right: -7px;
        width: 12px;
        height: 12px;
        background: #fefaec;
        border-top: 2px solid #ffbf00;
        border-right: 2px solid #ffbf00;
        transform: translateY(-50%) rotate(45deg);
      }
      .switch-icon {
        width: 40px;
        height: 40px;
        border: 0;
        background: transparent;
        padding: 0;
        cursor: pointer;
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .switch-icon svg {
        width: 40px;
        height: 40px;
        display: block;
        overflow: hidden;
      }
      .switch-icon path,
      .switch-icon rect,
      .switch-icon polyline {
        stroke: #ee4d2d;
        stroke-width: 3;
        fill: none;
        stroke-linecap: butt;
        stroke-linejoin: miter;
      }
      .switch-icon .fill {
        fill: #ee4d2d;
        stroke: none;
      }
      .switch-icon .fill-white {
        fill: #ffffff;
        stroke: none;
      }
      .switch-icon .text {
        fill: #ee4d2d;
        stroke: none;
        font-size: 12px;
        font-weight: 700;
        font-family: Arial, Helvetica, sans-serif;
      }
      .field { margin-bottom: 16px; }
      .input {
        width: 100%;
        height: 50px;
        border: 1px solid #d6d6d6;
        background: #ffffff;
        padding: 0 17px;
        font-size: 14px;
        color: #222222;
        outline: none;
      }
      .input::placeholder { color: #b9b9b9; }
      input[type='password']::-ms-reveal,
      input[type='password']::-ms-clear {
        display: none;
      }
      input[type='password']::-webkit-credentials-auto-fill-button,
      input[type='password']::-webkit-contacts-auto-fill-button,
      input[type='password']::-webkit-textfield-decoration-container {
        display: none !important;
        visibility: hidden;
        pointer-events: none;
      }
      .password-row {
        display: grid;
        grid-template-columns: 1fr 55px 124px;
        border: 1px solid #d6d6d6;
        background: #ffffff;
      }
      .password-row input {
        border: 0;
        height: 48px;
      }
      .eye {
        border: 0;
        border-left: 1px solid #ededed;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
      }
      .eye svg {
        width: 21px;
        height: 21px;
        stroke: #7d7d7d;
        stroke-width: 1.7;
        fill: none;
      }
      .eye.is-visible svg .eye-pupil {
        fill: #7d7d7d;
        stroke: none;
      }
      .eye.is-visible svg .eye-slash { opacity: 0; }
      .forgot {
        border-left: 1px solid #ededed;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0055aa;
        font-size: 14px;
        line-height: 1.25;
        padding: 0 12px;
        text-align: left;
      }
      .login-btn {
        width: 100%;
        height: 50px;
        border: 0;
        background: #f96f5d;
        color: #ffffff;
        text-transform: uppercase;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        margin-top: 9px;
      }
      .remember {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-top: 16px;
        color: #333333;
        font-size: 14px;
      }
      .remember-toggle {
        border: 0;
        background: transparent;
        padding: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: inherit;
        cursor: pointer;
      }
      .remember-box {
        width: 22px;
        height: 22px;
        border-radius: 2px;
        border: 1px solid #cfcfcf;
        background: #ffffff;
        color: transparent;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 700;
      }
      .remember-toggle.is-checked .remember-box {
        border-color: #ee4d2d;
        background: #ee4d2d;
        color: #ffffff;
      }
      .help-icon {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid #9c9c9c;
        color: #7a7a7a;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .divider {
        display: flex;
        align-items: center;
        gap: 18px;
        margin: 18px 0;
        color: #c5c5c5;
        font-size: 14px;
        text-transform: uppercase;
      }
      .divider::before, .divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #dfdfdf;
      }
      .socials {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }
      .social {
        height: 48px;
        border: 1px solid #cfcfcf;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        color: #222222;
        font-size: 18px;
        cursor: pointer;
      }
      .social-mark {
        font-weight: 700;
        font-size: 22px;
      }
      .terms {
        margin: 34px auto 0;
        max-width: 360px;
        text-align: center;
        color: #333333;
        font-size: 14px;
        line-height: 1.45;
      }
      .terms span,
      .signup span { color: #ee4d2d; }
      .signup {
        margin-top: 30px;
        text-align: center;
        color: #c8c8c8;
        font-size: 16px;
      }
      .qr-panel { text-align: center; }
      .qr-box {
        position: relative;
        width: 210px;
        height: 210px;
        margin: 4px auto 28px;
      }
      .qr-canvas {
        width: 210px;
        height: 210px;
        display: grid;
        grid-template-columns: repeat(29, 1fr);
        grid-template-rows: repeat(29, 1fr);
        gap: 0;
        background: #ffffff;
      }
      .qr-cell { background: #ffffff; }
      .qr-cell.is-dark { background: #111111; }
      .qr-logo {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: #ffffff;
        box-shadow: 0 0 0 4px #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .qr-logo span {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: #ee4d2d;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 700;
        line-height: 1;
      }
      .qr-description {
        margin: 0;
        color: #222222;
        font-size: 17px;
        line-height: 1.4;
      }
      .qr-help {
        display: inline-block;
        margin-top: 30px;
        color: #0055aa;
        font-size: 14px;
        text-decoration: none;
      }
      .qr-footer {
        margin-top: 28px;
        text-align: center;
      }
      .qr-footer .remember {
        margin-top: 0;
      }
      .qr-footer .signup {
        margin-top: 38px;
      }
    </style>
  </head>
  <body>
    <div class="window">
      <div class="titlebar">
        <div class="titlebar-left">
          <span class="mini-logo">S</span>
          <div class="title-lines">
            <p>Đăng nhập đến Shopee - Google Chrome</p>
            <p class="subtitle">accounts.shopee.vn/seller/login</p>
          </div>
        </div>
        <button class="close" type="button" aria-label="Đóng cửa sổ" onclick="window.close()">×</button>
      </div>

      <div class="content">
        <div class="card">
          <div id="password-view" class="view is-active">
            <div class="header">
              <h1 class="title">Đăng nhập</h1>
              <div class="switch-wrap">
                <button class="switch-badge" id="open-qr" type="button">Đăng nhập<br />với mã QR</button>
                <button class="switch-icon qr-icon" id="open-qr-icon" type="button" aria-label="Đăng nhập với mã QR">
                  <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                    <g clip-path="url(#qr-switch-clip)">
                      <path class="fill" fill-rule="evenodd" clip-rule="evenodd" d="M18 0H0v18h18V0zM3 15V3h12v12H3zM18 22H0v18h18V22zm-3 15H3V25h12v12zM40 0H22v18h18V0zm-3 15H25V3h12v12z"></path>
                      <path class="fill" d="M37 37H22.5v3H40V22.5h-3V37z"></path>
                      <path class="fill" d="M27.5 32v-8h-3v8h3zM33.5 32v-8h-3v8h3zM6 6h6v6H6zM6 28h6v6H6zM28 6h6v6h-6z"></path>
                      <path class="fill-white" d="M-4.3 4l44 43.9-22.8 22.7-43.9-44z"></path>
                    </g>
                    <defs>
                      <clipPath id="qr-switch-clip">
                        <path d="M0 0h40v40H0z"></path>
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
            </div>

            <div class="field">
              <input class="input" type="text" placeholder="Email/Số điện thoại/Tên đăng nhập" />
            </div>

            <div class="field">
              <div class="password-row">
                <input id="shopee-password" class="input" type="password" placeholder="Mật khẩu" />
                <button class="eye" id="password-toggle" type="button" aria-label="Hiện mật khẩu" aria-pressed="false">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2.7 12s3.3-5.3 9.3-5.3 9.3 5.3 9.3 5.3-3.3 5.3-9.3 5.3S2.7 12 2.7 12Z"></path>
                    <circle class="eye-pupil" cx="12" cy="12" r="2.6"></circle>
                    <path class="eye-slash" d="M4.5 19.5 19.5 4.5"></path>
                  </svg>
                </button>
                <div class="forgot">Quên mật khẩu?</div>
              </div>
            </div>

            <button class="login-btn" type="button">Đăng nhập</button>

            <div class="remember">
              <button class="remember-toggle" type="button" aria-pressed="false">
                <span class="remember-box">✓</span>
                <span>Duy trì đăng nhập</span>
              </button>
              <span class="help-icon">?</span>
            </div>

            <div class="divider">Hoặc</div>

            <div class="socials">
              <button class="social" type="button"><span class="social-mark" style="color:#1877f2;">f</span>Facebook</button>
              <button class="social" type="button"><span class="social-mark" style="color:#ea4335;">G</span>Google</button>
            </div>

            <p class="terms">
              Bằng việc đăng nhập, bạn đồng ý với <span>Điều khoản dịch vụ</span> & <span>Chính sách bảo mật</span> của Shopee
            </p>

            <div class="signup">Bạn mới biết đến Shopee? <span>Đăng ký</span></div>
          </div>

          <div id="qr-view" class="view">
            <div class="header">
              <h1 class="qr-title">Đăng nhập với<br />mã QR</h1>
              <div class="switch-wrap">
                <button class="switch-badge" id="open-password" type="button">Đăng nhập<br />với mật khẩu</button>
                <button class="switch-icon password-icon" id="open-password-icon" type="button" aria-label="Đăng nhập với mật khẩu">
                  <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                    <g clip-path="url(#password-switch-clip)">
                      <rect x="1.5" y="1.5" width="37" height="28" rx="2.5"></rect>
                      <path d="M22 38.5h11"></path>
                      <path d="M21 29v9" stroke-width="10"></path>
                      <path class="fill-white" d="M-12.28 0l43.933 43.933-22.72 22.72L-35 22.72z"></path>
                      <path class="fill" d="M10.997 16.545l-2.76-.782.519-1.591 2.733 1.098-.176-3.067h1.723l-.176 3.129 2.663-1.081.519 1.608-2.813.783 1.846 2.338-1.397.993-1.6-2.567-1.582 2.479-1.397-.95 1.898-2.39zm8.156 0l-2.76-.782.52-1.591 2.732 1.098-.175-3.067h1.722l-.175 3.129 2.663-1.081.518 1.608-2.812.783 1.845 2.338-1.397.993-1.6-2.567-1.582 2.479-1.397-.95 1.898-2.39zm8.157 0l-2.76-.782.518-1.591 2.734 1.098-.176-3.067h1.723l-.176 3.129 2.663-1.081.519 1.608-2.813.783 1.846 2.338-1.398.993-1.6-2.567-1.581 2.479-1.398-.95 1.899-2.39z"></path>
                    </g>
                    <defs>
                      <clipPath id="password-switch-clip">
                        <path fill="#fff" d="M0 0h40v40H0z"></path>
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
            </div>

            <div class="qr-panel">
              <div class="qr-box">
                <div id="mock-qr" class="qr-canvas" aria-label="Mã QR mẫu"></div>
                <div class="qr-logo"><span>S</span></div>
              </div>

              <p class="qr-description">Quét mã QR bằng ứng dụng Shopee</p>
              <a class="qr-help" href="javascript:void(0)">Làm Thế Nào Để Quét Mã?</a>

              <div class="qr-footer">
                <div class="remember">
                  <button class="remember-toggle" type="button" aria-pressed="false">
                    <span class="remember-box">✓</span>
                    <span>Duy trì đăng nhập</span>
                  </button>
                  <span class="help-icon">?</span>
                </div>

                <div class="signup">Bạn mới biết đến Shopee? <span>Đăng ký</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      const passwordInput = document.getElementById('shopee-password');
      const passwordToggle = document.getElementById('password-toggle');
      const passwordView = document.getElementById('password-view');
      const qrView = document.getElementById('qr-view');
      const openQr = document.getElementById('open-qr');
      const openQrIcon = document.getElementById('open-qr-icon');
      const openPassword = document.getElementById('open-password');
      const openPasswordIcon = document.getElementById('open-password-icon');
      const qrCanvas = document.getElementById('mock-qr');
      const loginButton = document.querySelector('.login-btn');
      const qrBox = document.querySelector('.qr-box');

      const notifyShopeeConnected = (message) => {
        const payload = {
          type: 'CHANNEL_CONNECTED',
          platformId: 'shopee',
          status: 'success',
          connectedCount: 1,
          connectedLabel: 'shop',
          message,
        };

        if (window.opener) {
          window.opener.postMessage(payload, window.location.origin);
        }

        setTimeout(() => window.close(), 250);
      };

      if (passwordInput && passwordToggle) {
        passwordToggle.addEventListener('click', () => {
          const isVisible = passwordInput.type === 'text';
          passwordInput.type = isVisible ? 'password' : 'text';
          passwordToggle.classList.toggle('is-visible', !isVisible);
          passwordToggle.setAttribute('aria-pressed', String(!isVisible));
          passwordToggle.setAttribute('aria-label', isVisible ? 'Hiện mật khẩu' : 'Ẩn mật khẩu');
        });
      }

      document.querySelectorAll('.remember-toggle').forEach((toggle) => {
        toggle.addEventListener('click', () => {
          const isChecked = toggle.classList.toggle('is-checked');
          toggle.setAttribute('aria-pressed', String(isChecked));
        });
      });

      const setView = (view) => {
        if (!passwordView || !qrView) return;
        passwordView.classList.toggle('is-active', view === 'password');
        qrView.classList.toggle('is-active', view === 'qr');
      };

      openQr?.addEventListener('click', () => setView('qr'));
      openQrIcon?.addEventListener('click', () => setView('qr'));
      openPassword?.addEventListener('click', () => setView('password'));
      openPasswordIcon?.addEventListener('click', () => setView('password'));

      loginButton?.addEventListener('click', () => {
        notifyShopeeConnected('Shopee đã được kết nối thành công.');
      });

      qrBox?.addEventListener('click', () => {
        if (qrView?.classList.contains('is-active')) {
          notifyShopeeConnected('Shopee đã được kết nối thành công qua mã QR.');
        }
      });

      const qrSize = 29;
      const qrPattern = [
        '11111110010010100100111111111',
        '10000010101100111010100000001',
        '10111010110011100110101110101',
        '10111010001100101000101110101',
        '10111010111011101110101110101',
        '10000010010001001000100000001',
        '11111110101010101010111111111',
        '00000000110100110010000000000',
        '10101111001011101100101110110',
        '01010000110100010011110001001',
        '11100110100111100101100110011',
        '00111001011100011110011001100',
        '11001110010000000001001110101',
        '00110101101000000010110101010',
        '10110010010000000001001001101',
        '01001101101100011100110010110',
        '11100010110011100111001001001',
        '00011101001101011000110110010',
        '10101011110010100110101101011',
        '01100100001101110001010011100',
        '11010011100110001110100100101',
        '00000000111001010110000000000',
        '11111110100111100010111111111',
        '10000010111000101100100000001',
        '10111010100111010010101110101',
        '10111010011001101000101110101',
        '10111010101110011110101110101',
        '10000010000101100010100000001',
        '11111110111010010100111111111',
      ];

      if (qrCanvas) {
        qrPattern.forEach((row) => {
          row.split('').forEach((value) => {
            const cell = document.createElement('span');
            cell.className = 'qr-cell';
            if (value === '1') cell.classList.add('is-dark');
            qrCanvas.appendChild(cell);
          });
        });
      }
    </script>
  </body>
</html>`

export async function GET() {
  return new NextResponse(shopeePopupHtml, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  })
}

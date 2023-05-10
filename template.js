export default ({ markup, css }) => {
  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8"> 
        <script src='https://js.stripe.com/v3/' crossorigin="anonymous"></script>
      </head>
      <body style="margin:0">
        <div id="root">${markup}</div>
        <style id="jss-server-side">${css}</style>
        <script type="text/javascript" src="/dist/bundle.js"></script>
      </body>
    </html>`;
};

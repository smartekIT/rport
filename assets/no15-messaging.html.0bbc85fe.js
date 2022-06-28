import{_ as d,r,o as l,c,a as t,b as s,w as a,e,d as o}from"./app.00ec766f.js";const u={},h=t("h1",{id:"messaging",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#messaging","aria-hidden":"true"},"#"),e(" Messaging")],-1),p=e("Some features require the rport server to send messages, e.g., "),_=e("2FA Auth"),v=e(" requires sending a verification code to a user. It can be done using:"),m=e("email (requires "),g=e("SMTP"),f=e(" setup)"),b={href:"https://pushover.net",target:"_blank",rel:"noopener noreferrer"},x=e("pushover.net"),T=e(" (requires "),R=e("Pushover"),k=e(" setup)"),w=o(`<h2 id="smtp" tabindex="-1"><a class="header-anchor" href="#smtp" aria-hidden="true">#</a> SMTP</h2><p>To enable sending emails, enter the following lines to the <code>rportd.config</code>, for example:</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>[smtp]
  server = &#39;smtp.example.com:2525&#39;
  sender_email = &#39;rport@gmail.com&#39;
  auth_username = &#39;john.doe&#39;
  auth_password = &#39;secret&#39;
  secure = false
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Required:</p><ul><li><code>server</code> - smtp server and port separated by a colon, e.g. <code>smtp.example.com:2525</code>. If you use port 465 with Implicit(Forced) TLS then <code>secure</code> param should be enabled.</li><li><code>sender_email</code> - an email that is used by rport server as its sender.</li></ul><p>Optional:</p><ul><li><code>auth_username</code> - a username for authentication;</li><li><code>auth_password</code> - a password for the username;</li><li><code>secure</code> - <code>true|false</code>, set to <code>true</code> if Implicit(Forced) TLS must be used.</li></ul><h2 id="pushover" tabindex="-1"><a class="header-anchor" href="#pushover" aria-hidden="true">#</a> Pushover</h2>`,8),y=e("Follow a "),O={href:"https://support.pushover.net/i7-what-is-pushover-and-how-do-i-use-it",target:"_blank",rel:"noopener noreferrer"},P=e("link"),A=e(" to have a quick Pushover intro."),E=t("p",null,"In order to enable sending messages via pushover:",-1),q={href:"https://pushover.net/signup",target:"_blank",rel:"noopener noreferrer"},S=e("Register"),F=e(" pushover account (if you don't have an existing account)."),I={href:"https://pushover.net/apps/build",target:"_blank",rel:"noopener noreferrer"},N=e("Register"),L=e(" pushover API token that will be used to send messages by rport server (if you don't have it yet)."),M=t("li",null,[e("Enter the following lines to the "),t("code",null,"rportd.config"),e(", for example:")],-1),K=o(`<div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>[pushover]
  api_token = &quot;afapzrcv5801jeaw71b4odjyn1m2e5&quot;
  user_key = &quot;pgcjszdyures33k4m4e12e9ggc1syo&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),U={start:"4"},B=e("Use any of "),D={href:"https://pushover.net/clients",target:"_blank",rel:"noopener noreferrer"},j=e("pushover device clients"),$=e(" to receive the messages."),z=o(`<h2 id="script" tabindex="-1"><a class="header-anchor" href="#script" aria-hidden="true">#</a> Script</h2><p>You can create a custom script to send the 2FA verification code. This way you can use messengers like Telegram and many others. Inside the <code>[api]</code> section of <code>rportd.conf</code> insert the full path to an executable script for <code>two_fa_token_delivery</code> parameter. For example:</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>two_fa_token_delivery = &#39;/usr/local/bin/2fa-sender&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>The token and the recipient&#39;s details are passed as environmental variables to the script. Create the file <code>/usr/local/bin/2fa-sender</code> with the following content, and make the script executable with <code>chmod +x</code>.</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>#!/bin/bash
date &gt; /tmp/2fa-sender.txt
printenv &gt;&gt; /tmp/2fa-sender.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Try to log in, and the script creates the following output.</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>Fri Aug 13 13:36:25 UTC 2021
RPORT_2FA_SENDTO=email@example.com
RPORT_2FA_TOKEN_TTL=600
RPORT_2FA_TOKEN=7SM7j2
RPORT_2FA_USER_AGENT=&#39;Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:99.0) Gecko/20100101 Firefox/99.0&#39;
RPORT_2FA_REMOTE_ADDRESS=::1
snip..snap
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The value of <code>RPORT_2FA_SENDTO</code> may vary. It&#39;s the value specified in the 2fa_sendto column of the user table or the auth file.</p><p>Additionally, you can specify how the api should validate updates of the 2fa_sendto. This prevents users entering values that cannot be processed by your script. Use <code>two_fa_send_to_type = &#39;email&#39;</code> to accept only valid email address or specify a regular expression.</p><p>If the script exits with an exit code other than <code>0</code> the API request returns HTTP Status code 500 along with the STDERR output of the script.</p><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>When handing over the token using curl, consider using the <code>-f</code> option of curl. On any other http status code than 200 curl will exit with a non-zero status code. This way the rport server knows about a failed request, and the API includes the error for further processing.</p></div><h3 id="telegram-example" tabindex="-1"><a class="header-anchor" href="#telegram-example" aria-hidden="true">#</a> Telegram example</h3>`,12),C=e("A script that sends the token via Telegram can work like this example. You must "),V={href:"https://core.telegram.org/bots#6-botfather",target:"_blank",rel:"noopener noreferrer"},Y=e("create a bot"),G=e(" first and grab the token of it."),X=o(`<div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>#!/bin/sh
BOT_TOKEN=&quot;&lt;YOUR_BOT_TOKEN&gt;&quot;
URL=&quot;https://api.telegram.org/bot\${BOT_TOKEN}/sendMessage&quot;
curl -fs -X POST $URL \\
  -d chat_id=$RPORT_2FA_SENDTO \\
  -d text=&quot;Your RPort 2fa token: $RPORT_2FA_TOKEN (valid for $RPORT_2FA_TOKEN_TTL seconds)&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1);function H(W,J){const i=r("RouterLink"),n=r("ExternalLinkIcon");return l(),c("div",null,[h,t("p",null,[p,s(i,{to:"/docs/no02-api-auth.html#two-factor-auth"},{default:a(()=>[_]),_:1}),v]),t("ol",null,[t("li",null,[m,s(i,{to:"/docs/no15-messaging.html#smtp"},{default:a(()=>[g]),_:1}),f]),t("li",null,[t("a",b,[x,s(n)]),T,s(i,{to:"/docs/no15-messaging.html#pushover"},{default:a(()=>[R]),_:1}),k])]),w,t("p",null,[y,t("a",O,[P,s(n)]),A]),E,t("ol",null,[t("li",null,[t("a",q,[S,s(n)]),F]),t("li",null,[t("a",I,[N,s(n)]),L]),M]),K,t("ol",U,[t("li",null,[B,t("a",D,[j,s(n)]),$])]),z,t("p",null,[C,t("a",V,[Y,s(n)]),G]),X])}var Z=d(u,[["render",H],["__file","no15-messaging.html.vue"]]);export{Z as default};
